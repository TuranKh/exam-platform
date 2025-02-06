import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DateUtils from "@/lib/date-utils";
import ExamService from "@/service/ExamService";
import StorageService from "@/service/StorageService";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  BadgePlus,
  BookOpen,
  CircleChevronRight,
  Eraser,
  Loader,
  Upload,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import "./Exam.scss";
import { Question } from "./question";

type Question = {
  id: string;
  file?: File;
  filePath?: string;
  manualText?: string;
  correctAnswer: string | null;
  description?: string;
};

export default function Exam() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<{
    name: string;
    duration: number;
  }>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [creationAllowed, setCreationAllowed] = useState(false);
  const [imageUploadingLoading, setImageUploadingLoading] = useState(false);

  const { data: existingExamDetails, isLoading } = useQuery({
    queryKey: ["get-exam", id],
    queryFn: async () => {
      return ExamService.getExam(Number(id), true);
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingExamDetails) {
      setExamDetails({
        duration: existingExamDetails.duration,
        name: existingExamDetails.name,
      });
      setQuestions(() => {
        const existingQuestions = JSON.parse(existingExamDetails.questions);
        const existingAnswers = JSON.parse(existingExamDetails.answers);
        return existingQuestions.map(
          (question: {
            id: string;
            answerId: number;
            filePath: string;
            description: string;
          }) => {
            return {
              id: question.id,
              correctAnswer: existingAnswers[question.id],
              filePath: question.filePath,
              description: question.description,
            };
          },
        );
      });
    } else if (!isLoading) {
      setExamDetails({});
      setQuestions([]);
    }
  }, [isEditMode, existingExamDetails]);

  useEffect(() => {
    setCreationAllowed(questions.length !== 0);
  }, [questions.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newPendingQuestions = getNewFileDetails(files);
    setQuestions((prev) => [...prev, ...newPendingQuestions]);
    e.target.value = null as any;
  }

  const getNewFileDetails = function (files: File[]) {
    return files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      correctAnswer: null,
    }));
  };

  function removePendingQuestion(index: number) {
    setQuestions((prev) => {
      const editted = [...prev].splice(index, 1);
      return editted;
    });
  }

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

    const unansweredQuestion = questions.find((question) => {
      return !question.correctAnswer;
    });
    if (unansweredQuestion) {
      toast.error("Cavabsız suallar mövcuddur");
      navigate(`#${unansweredQuestion.id}`);
      return;
    }

    if (isEditMode) {
      await editExam();
      queryClient.invalidateQueries("exams-select");
      return;
    }
    await createNewExam();
    queryClient.invalidateQueries("exams-select");
  }

  async function editExam() {
    const randomIdentifier = crypto.randomUUID();
    const answers: Record<string, string | null> = {};
    setImageUploadingLoading(true);

    const questionDetails = await Promise.all(
      questions.map(async (questionDetails) => {
        let filePath: string | null | undefined = null;

        if (questionDetails.file) {
          const fileDetails = await StorageService.uploadFileToStorage(
            questionDetails.file,
            randomIdentifier,
          );
          filePath = fileDetails?.path;
        } else if (questionDetails.filePath) {
          filePath = questionDetails.filePath;
        }
        answers[questionDetails.id] = questionDetails.correctAnswer;

        return {
          id: questionDetails.id,
          answerId: questionDetails.correctAnswer,
          filePath: filePath,
          description: questionDetails.description,
        };
      }),
    );

    const finalExamDetails = {
      name: examDetails.name,
      duration: examDetails.duration,
      questionsCount: questionDetails.length,
      questions: JSON.stringify(questionDetails),
      answers: JSON.stringify(answers),
    };
    const requestResult = await ExamService.updateExam(
      Number(id!),
      finalExamDetails,
    );

    setImageUploadingLoading(false);

    if (requestResult) {
      invalidateQueries();
      toast.success("İmtahan uğurla redaktə edildi");
      navigate("/exams");
    } else {
      toast.error("İmtahan redaktə edərkən xəta baş verdi");
    }
  }

  const invalidateQueries = function () {
    queryClient.invalidateQueries({
      queryKey: ["get-exam", id],
    });
    queryClient.invalidateQueries({
      queryKey: ["permissions-exams"],
    });
  };

  async function createNewExam() {
    const randomIdentifier = crypto.randomUUID();
    const requests = questions.map((question) => {
      return StorageService.uploadFileToStorage(
        question.file!,
        randomIdentifier,
      );
    });
    setImageUploadingLoading(true);
    const fileUploadResult = await Promise.all(requests);

    const answers: Record<string, string | null> = {};
    const questionDetails = fileUploadResult.map((value, index) => {
      if (value?.id) {
        answers[value.id] = questions[index].correctAnswer;
      }

      return {
        id: value?.id,
        filePath: value?.path,
        description: questions[index].description,
      };
    });

    const finalExamDetails = {
      name: examDetails.name,
      duration: examDetails.duration,
      questionsCount: questions.length,
      questions: JSON.stringify(questionDetails),
      answers: JSON.stringify(answers),
      createdAt: DateUtils.getServerDate(new Date()),
    };

    toast.promise(ExamService.createExam(finalExamDetails), {
      loading: "Yeni imtahan yaranır...",
      success: () => {
        invalidateQueries();
        setImageUploadingLoading(false);
        navigate("/exams");
        return "Yeni imtahan uğurla yaradıldı";
      },
      error: () => {
        setImageUploadingLoading(false);
        return "Yeni imtahan yaradarkən xəta baş verdi";
      },
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active?.id && over?.id && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const deleteQuestions = function () {
    setQuestions([]);
  };

  const onManualFileDrop = function (event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newQuestions = getNewFileDetails(Array.from(droppedFiles || []));
      setQuestions((prev) => [...prev, ...newQuestions]);
    }
  };

  const inputChange = function (e: ChangeEvent<HTMLInputElement>) {
    setExamDetails((current) => {
      return {
        ...current,
        [e.target.name]: e.target.value,
      };
    });
  };

  const uploadSingleImage = function (file: File, index: number) {
    setQuestions((current) => {
      const modified = [...current];
      modified.splice(index, 1, {
        ...modified[index],
        file,
      });

      return modified;
    });
  };

  const manualQuestionAdd = function () {
    const newImageDetails: Question = {
      correctAnswer: null,
      id: crypto.randomUUID(),
    };
    setQuestions((prev) => {
      return [...prev, newImageDetails];
    });
  };

  const updateDescription = function (index: number, html: string) {
    setQuestions((current) => {
      const modified = [...current];
      modified.splice(index, 1, {
        ...modified[index],
        description: html,
      });

      return modified;
    });
  };

  return (
    <Card className='exam-wrapper'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Yeni imtahan</CardTitle>
        <BookOpen className='h-4 w-4 text-muted-foreground' />
      </CardHeader>
      <CardContent>
        <div className='exam-content'>
          <div>
            <div className='exam-details'>
              <Input
                onChange={inputChange}
                name='name'
                value={examDetails.name}
                id='exam-name'
                placeholder='İmtahanın adı'
              />
              <Input
                name='duration'
                value={examDetails.duration}
                onChange={inputChange}
                min={0}
                id='duration'
                placeholder='İmtahanın müddəti (dəq)'
                type='number'
              />
              {/* <AddQuestion /> */}
            </div>

            <form
              onSubmit={handleSubmit}
              onDragOver={(event) => event.preventDefault()}
              className='space-y-6'
            >
              <div className='space-y-4'>
                <label className='block'>
                  <div
                    onDrop={onManualFileDrop}
                    className='mt-1 flex items-center space-x-4'
                  >
                    <label className='flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none'>
                      <div className='flex flex-col items-center space-y-2'>
                        <Upload className='w-6 h-6 text-gray-400' />
                        <span className='text-sm text-gray-400'>
                          Birneçə şəkil yükləyin
                        </span>
                      </div>
                      <input
                        type='file'
                        className='hidden'
                        accept='image/*'
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </label>
                <div className='flex justify-center'>
                  <Button onClick={manualQuestionAdd} type='button'>
                    Sual əlavə edin
                    <BadgePlus />
                  </Button>
                </div>

                {questions.length > 0 && (
                  <div className='questions-wrapper'>
                    <h3 className='font-medium text-gray-900'>
                      İmtahan sualları
                    </h3>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={questions.map((item) => item.id)}
                        strategy={rectSortingStrategy}
                      >
                        <div className='questions'>
                          {questions.map((question, index) => (
                            <Question
                              index={index}
                              key={question.id}
                              question={question}
                              removePendingQuestion={removePendingQuestion}
                              updateCorrectAnswer={updateCorrectAnswer}
                              uploadSingleImage={(file: File) =>
                                uploadSingleImage(file, index)
                              }
                              updateDescription={updateDescription}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                )}
              </div>
              <div className='actions'>
                <Button
                  type='button'
                  onClick={deleteQuestions}
                  variant={"destructive"}
                  disabled={questions.length === 0 || imageUploadingLoading}
                >
                  Sualları sil {questions.length ? `(${questions.length})` : ""}
                  <Eraser />
                </Button>
                <Button
                  type='submit'
                  disabled={!creationAllowed || imageUploadingLoading}
                >
                  {isEditMode ? "Yadda saxla" : "Yarat"}
                  {imageUploadingLoading ? (
                    <Loader className='animate-spin' />
                  ) : (
                    <CircleChevronRight />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
