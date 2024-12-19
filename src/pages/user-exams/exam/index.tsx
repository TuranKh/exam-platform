import placeholderImage from "@/assets/placeholder.webp";
import { Countdown } from "@/components/Countdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination";
import { answerOptions } from "@/pages/exams/exam";
import ExamService from "@/service/ExamService";
import StorageService from "@/service/StorageService";
import { BookOpen, CircleChevronRight, Eraser, Timer } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "./Exam.scss";

interface Question {
  id: string;
  file?: File;
  correctAnswer: string | null;
  filePath?: string;
}

export default function Exam() {
  const [showTimer, setShowTimer] = useState(true);
  const paginationDetails = usePagination(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<{
    name: string;
    duration: number;
  }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const { data: existingExamDetails, isLoading } = useQuery({
    queryKey: ["get-exam", id],
    queryFn: async () => {
      const details = ExamService.getExam(Number(id), false);
      return details;
    },
  });

  useEffect(() => {
    (async () => {
      if (existingExamDetails) {
        setExamDetails({
          duration: existingExamDetails.duration,
          name: existingExamDetails.name,
        });
        setQuestions(() => {
          const existingQuestions = JSON.parse(existingExamDetails.questions);
          paginationDetails.setTotalRowsNumber(existingQuestions.length);
          return existingQuestions.map(
            (question: { id: string; answerId: number; filePath: string }) => {
              return {
                id: question.id,
                correctAnswer: question.answerId,
                filePath: question.filePath,
              };
            },
          );
        });
      } else if (!isLoading) {
        toast.error("İmtahan tapılmadı!");
        navigate("/available-exams");
      }
    })();
  }, [existingExamDetails, isLoading]);

  function updateCorrectAnswer(id: string, value: string) {
    setQuestions((prev) => {
      const newPendingQuestions = [...prev];
      const index = newPendingQuestions.findIndex((item) => item.id === id);
      if (index !== -1) {
        newPendingQuestions[index].correctAnswer = value;
      }
      return newPendingQuestions;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitAnswers();
  }

  async function submitAnswers() {
    const answers: Record<string, string | null> = {};

    const finalExamDetails = {
      name: examDetails.name,
      duration: examDetails.duration,
      questionsCount: questions.length,
      questions: JSON.stringify(questionDetails),
      answers: JSON.stringify(answers),
    };

    const result = await ExamService.createExam(finalExamDetails);

    if (result) {
      toast.success("Yeni imtahan uğurla yaradıldı");
      navigate("/exams");
    }
  }

  const resetAnswers = function () {};

  const activeQuestion = useMemo(() => {
    return questions[paginationDetails.page];
  }, [paginationDetails.page, questions]);

  const totalPages = useMemo(() => {
    return Math.ceil(
      paginationDetails.totalRowsNumber / paginationDetails.perPage,
    );
  }, [paginationDetails.totalRowsNumber, paginationDetails.perPage]);

  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }, [totalPages]);

  const onKeyPress = function (event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowRight":
        paginationDetails.setPage((current) => current + 1);
        return;
      case "ArrowLeft":
        paginationDetails.setPage((current) => current - 1);
        return;
    }
  };

  return (
    <>
      {examDetails?.duration && (
        <div className='absolute right-10 float-right flex flex-col gap-2 items-end'>
          <Timer
            className='cursor-pointer'
            onClick={() => {
              setShowTimer((current) => {
                return !current;
              });
            }}
          />
          <div className={`${showTimer ? "block" : "hidden"}`}>
            <Countdown initialTime={examDetails.duration * 60} />
          </div>
        </div>
      )}
      <Card className='user-exam-wrapper'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-medium mb-2'>
            {examDetails.name}
          </CardTitle>
          <BookOpen className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='exam-content'>
            <div>
              <form
                onKeyDown={onKeyPress}
                onSubmit={handleSubmit}
                onDragOver={(event) => event.preventDefault()}
                className='space-y-6'
              >
                <div className='space-y-4'>
                  {questions.length > 0 && (
                    <div className='questions-wrapper'>
                      <div className='questions'>
                        <Question
                          key={activeQuestion.id}
                          index={paginationDetails.page}
                          question={activeQuestion}
                          updateCorrectAnswer={updateCorrectAnswer}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <Pagination>
                  <PaginationContent>
                    {pageNumbers.map((page: number) => {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href='#'
                            className={
                              questions?.[page - 1]?.correctAnswer
                                ? "answered"
                                : "not-answered"
                            }
                            isActive={page - 1 === paginationDetails.page}
                            onClick={(e) => {
                              e.preventDefault();
                              paginationDetails.setPage((page - 1) as number);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  </PaginationContent>
                </Pagination>

                <div className='actions'>
                  <Button
                    type='button'
                    onClick={resetAnswers}
                    variant={"destructive"}
                    disabled={questions.length === 0}
                  >
                    Cavabları sıfırla
                    <Eraser />
                  </Button>
                  <Button type='submit'>
                    Təsdiqlə
                    <CircleChevronRight />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const Question = React.memo(function Question({
  question,
  updateCorrectAnswer,
  index,
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (question.file) {
      const url = URL.createObjectURL(question.file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (question.filePath) {
      const fetchImage = async () => {
        setLoading(true);
        const data = await StorageService.getFile(question.filePath);
        if (data) {
          setImageUrl(data.publicUrl);
        }
        setLoading(false);
      };
      fetchImage();
    }
  }, [question]);

  return (
    <div className='relative border rounded-lg p-4 flex items-center'>
      <div className='drag-handle mr-2 absolute top-2 left-2 p-1 rounded-full'>
        Sual: {index + 1}
      </div>
      {loading ? (
        <img
          src={placeholderImage}
          alt='placeholder'
          className='question-image'
        />
      ) : (
        <img
          loading='lazy'
          src={imageUrl!}
          alt='Question'
          className='question-image'
        />
      )}
      <div>
        <select
          value={question.correctAnswer || ""}
          onChange={(e) => updateCorrectAnswer(question.id, e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white'
        >
          <option value='' disabled>
            Cavabı seç
          </option>
          {answerOptions.map((answer) => {
            return <option key={answer}>{answer}</option>;
          })}
        </select>
      </div>
    </div>
  );
});
