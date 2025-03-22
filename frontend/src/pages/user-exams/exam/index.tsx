import { Countdown } from "@/components/Countdown";
import CustomSelect from "@/components/FormBuilder/components/CustomSelect";
import IconButton from "@/components/IconButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import usePagination from "@/hooks/usePagination";
import useWindowSize from "@/hooks/useWindowSize";
import { selectAnswerOptions } from "@/lib/exam";
import ExamService from "@/service/ExamService";
import StorageService from "@/service/StorageService";
import UserExamsService from "@/service/UserExamsService";
import { differenceInSeconds } from "date-fns";
import {
  BookOpen,
  CircleChevronRight,
  Eraser,
  Flag,
  Timer,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "./Exam.scss";
import placeholderImage from "/assets/placeholder.webp";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  file?: File;
  correctAnswer: string | null;
  filePath?: string;
}

type Answer = Record<string, string | null>;

export default function Exam() {
  const queryClient = useQueryClient();
  const [examIsOngoing, setExamIsOngoing] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const paginationDetails = usePagination(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [examDetails, setExamDetails] = useState<{
    name: string;
    duration: number;
    id: number;
    isFinished: boolean;
    score: number;
  }>({});
  const [questions, setQuestions] = useState<
    Array<Omit<Question, "correctAnswer"> & { flagged?: boolean }>
  >([]);
  const [answers, setAnswers] = useState<Answer>({});
  const [examAnswers, setExamAnswers] = useState<Answer | null>();

  const { data: existingExamDetails, isLoading } = useQuery({
    queryKey: ["get-exam", id],
    queryFn: async () => {
      const examDetails = await UserExamsService.startExam(Number(id));
      return examDetails[0];
    },
  });

  useEffect(() => {
    const storedAnswers = sessionStorage.getItem("answers");

    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    if (examDetails.isFinished) {
      fetchAndSetExams();
      setExamIsOngoing(false);
    }
  }, [examDetails]);

  useEffect(() => {
    const storeAnswers = function () {
      window.sessionStorage.setItem("answers", JSON.stringify(answers));
    };
    window.onbeforeunload = storeAnswers;

    return () => {
      window.onbeforeunload = null;
    };
  }, [answers]);

  useEffect(() => {
    (async () => {
      if (!existingExamDetails) {
        if (!isLoading) {
          toast.error("İmtahan tapılmadı!");
          navigate("/available-exams");
        }
        return;
      }
      setAnswers(existingExamDetails.submittedAnswers || {});
      setExamDetails({
        duration: existingExamDetails.duration,
        name: existingExamDetails.name,
        id: existingExamDetails.examId,
        isFinished: existingExamDetails.isFinished,
        score: existingExamDetails.score,
      });
      setQuestions(() => {
        const existingQuestions = JSON.parse(existingExamDetails.questions);
        paginationDetails.setTotalRowsNumber(existingQuestions.length);
        return existingQuestions.map(
          (question: { id: string; answerId: number; filePath: string }) => {
            return {
              id: question.id,
              filePath: question.filePath,
            };
          },
        );
      });
    })();
  }, [existingExamDetails, isLoading, navigate]);

  function updateCorrectAnswer(id: string, value: string) {
    setAnswers((curr) => {
      return {
        ...curr,
        [id]: value,
      };
    });
  }

  const activeQuestion = useMemo(() => {
    const questionDetails = questions[paginationDetails.page];
    return {
      ...questionDetails,
      correctAnswer: answers[questionDetails?.id],
    };
  }, [paginationDetails.page, questions, answers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitExam();
  }

  async function submitExam() {
    if (examDetails.isFinished) return;

    const { message, correctAnswers, score } =
      await UserExamsService.submitAnswers(Number(id), answers);
    queryClient.invalidateQueries("all-user-exams");

    if (message) {
      toast.success(message);
    }

    setExamDetails((current) => {
      return {
        ...current,
        score,
        isFinished: true,
      };
    });
    setExamAnswers(correctAnswers);
    setExamIsOngoing(false);
    queryClient.invalidateQueries("all-user-exams");
  }

  const fetchAndSetExams = async function () {
    const answersResponse = await ExamService.getExamAnswers(examDetails.id);
    const parsed = JSON.parse(answersResponse.answers);
    setExamAnswers(parsed);
  };

  const resetAnswers = function () {
    setAnswers({});
  };

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
        paginationDetails.setPage((current) =>
          current === paginationDetails.totalRowsNumber - 1
            ? current
            : current + 1,
        );
        return;
      case "ArrowLeft":
        paginationDetails.setPage((current) =>
          current === 0 ? current : current - 1,
        );
        return;
    }
  };

  const secondsLeft = useMemo(() => {
    if (!existingExamDetails) return 0;
    const started = new Date(existingExamDetails.startDate);
    const now = new Date();
    const difference = differenceInSeconds(started, now);

    return difference + existingExamDetails.duration * 60;
  }, [existingExamDetails]);

  const onTimeout = async function () {
    if (existingExamDetails.isFinished) {
      return;
    }

    await submitExam();
    toast("İmtahan vaxtınız bitdi", {
      icon: "☢️",
    });
  };

  const flagQuestion = function () {
    setQuestions((questions) => {
      const questionDetails = questions[paginationDetails.page];

      questions.splice(paginationDetails.page, 1, {
        ...questionDetails,
        flagged: !questionDetails.flagged,
      });
      return [...questions];
    });
  };

  const prefetchImage = async function (pageNumber: number) {
    const imageUrl = questions[pageNumber - 1].filePath;
    if (!imageUrl) {
      return;
    }

    const data = await StorageService.getFile(imageUrl as string);
    const img = new Image();
    img.src = data.publicUrl as string;
  };

  return (
    <>
      {!examIsOngoing && !examDetails.isFinished && (
        <Confetti
          numberOfPieces={1200}
          recycle={false}
          width={width}
          height={height}
        />
      )}
      {examDetails?.duration && examIsOngoing && (
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
            <Countdown
              onTimeout={onTimeout}
              totalDurationInSeconds={(existingExamDetails?.duration || 0) * 60}
              durationLeftInSeconds={secondsLeft}
            />
          </div>
        </div>
      )}
      <Card className='user-exam-wrapper'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-medium mb-2'>
            {examDetails.name}
            <br />
            {examDetails.isFinished && (
              <Badge>Topladığınız bal: {examDetails.score}</Badge>
            )}
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
                      <div className='questions relative'>
                        <Question
                          examIsOngoing={examIsOngoing}
                          key={activeQuestion.id}
                          index={paginationDetails.page}
                          question={activeQuestion}
                          updateCorrectAnswer={updateCorrectAnswer}
                        />
                        {examIsOngoing && (
                          <IconButton
                            onClick={flagQuestion}
                            className='absolute right-5 bottom-5 bg-amber-400	hover:bg-amber-400/90'
                          >
                            <Flag size={15} />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <Pagination>
                  <PaginationContent>
                    {pageNumbers.map((page: number) => {
                      const currentQuestion = questions[page - 1];
                      const isFlagged = currentQuestion?.flagged;
                      const userAnswer = answers[currentQuestion.id];
                      const correctAnswer = examAnswers?.[currentQuestion.id];
                      let className = "";

                      if (correctAnswer) {
                        if (userAnswer) {
                          if (userAnswer === correctAnswer) {
                            className += " correct";
                          } else {
                            className += " wrong";
                          }
                        } else {
                          className += " not-answered";
                        }
                      } else {
                        if (userAnswer) {
                          className += " answered";
                        } else {
                          className += " not-answered";
                        }
                      }

                      if (isFlagged) {
                        className += " flagged";
                      }

                      className.trim();

                      return (
                        <PaginationItem
                          onMouseOver={() => prefetchImage(page)}
                          key={page}
                        >
                          <PaginationLink
                            href='#'
                            className={className}
                            isActive={page - 1 === paginationDetails.page}
                            onClick={(e) => {
                              e.preventDefault();
                              paginationDetails.setPage(page - 1);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  </PaginationContent>
                </Pagination>

                {examIsOngoing && (
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
                      İmtahanı yekunlaşdır
                      <CircleChevronRight />
                    </Button>
                  </div>
                )}
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
  examIsOngoing,
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (question.filePath) {
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
    <div className='relative border rounded-lg px-4 py-12 flex items-center'>
      <div className='drag-handle mr-2 absolute top-2 left-2 p-1 rounded-full'>
        Sual: {index + 1}
      </div>
      {loading || imageUrl === null ? (
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

      <div className='flex items-center gap-4 w-60'>
        <CustomSelect
          formFieldDetails={{
            key: "selectedAnswer",
            onChange: (details) => {
              updateCorrectAnswer(question.id, details.selectedAnswer);
            },
            disabled: !examIsOngoing,
            label: "Düzgün cavabı seçin",
            value: question?.correctAnswer,
          }}
          options={selectAnswerOptions}
        />
        {examIsOngoing && (
          <IconButton
            onClick={() => {
              updateCorrectAnswer(question.id, null);
            }}
          >
            <X className='cursor-pointer' />
          </IconButton>
        )}
      </div>
    </div>
  );
});
