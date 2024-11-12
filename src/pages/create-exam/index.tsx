import {
  BookOpen,
  CircleChevronRight,
  Eraser,
  GripVertical,
  Upload,
  X,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

import "./CreateExam.scss";

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
  useSortable,
} from "@dnd-kit/sortable";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ExamService from "@/service/ExamService";
import StorageService from "@/service/StorageService";
import { AvailableDialogs, useVisualStore } from "@/store/VisualStore";
import { CSS } from "@dnd-kit/utilities";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: string;
  file?: File;
  correctAnswer: string | null;
  filePath?: string;
}

export default function CreateExam() {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState<{
    name: string;
    duration: number;
  }>({});
  const { setActiveDialog } = useVisualStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [creationAllowed, setCreationAllowed] = useState(false);

  const { data: existingExamDetails, isLoading } = useQuery({
    queryKey: ["get-exam", id],
    queryFn: async () => {
      return ExamService.getExam(Number(id));
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && existingExamDetails) {
      setExamDetails({
        duration: existingExamDetails[0].duration,
        name: existingExamDetails[0].name,
      });
      setQuestions(() => {
        const existingQuestions = JSON.parse(existingExamDetails[0].questions);
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
  }

  const getNewFileDetails = function (files: File[]) {
    return files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      correctAnswer: answerOptions[0],
    }));
  };

  function removePendingQuestion(id: string) {
    setQuestions((prev) => prev.filter((item) => item.id !== id));
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

    if (isEditMode) {
      editExam();
      return;
    }
    createNewExam();
  }

  async function editExam() {
    const randomIdentifier = crypto.randomUUID();

    const questionDetails = await Promise.all(
      questions.map(async (questionDetails) => {
        console.log(questionDetails);
        let filePath: string | null | undefined = null;

        if (questionDetails.file) {
          const fileDetails = await StorageService.uploadFileToStorage(
            questionDetails.file,
            randomIdentifier,
          );
          filePath = fileDetails?.path;
        } else if (questionDetails.filePath) {
          console.log("executed");
          filePath = questionDetails.filePath;
        }

        return {
          id: questionDetails.id,
          answerId: questionDetails.correctAnswer,
          filePath: filePath,
        };
      }),
    );

    const finalExamDetails = {
      name: examDetails.name,
      duration: examDetails.duration,
      questionsCount: questionDetails.length,
      questions: JSON.stringify(questionDetails),
    };

    const result = await ExamService.updateExam(Number(id), finalExamDetails);

    if (result) {
      toast.success("İmtahan uğurla redaktə edildi");
      navigate("/exams");
    }
  }

  async function createNewExam() {
    const randomIdentifier = crypto.randomUUID();
    const requests = questions.map((question) => {
      return StorageService.uploadFileToStorage(
        question.file!,
        randomIdentifier,
      );
    });

    const fileUploadResult = await Promise.all(requests);

    const questionDetails = fileUploadResult.map((value, index) => {
      return {
        id: value?.id,
        answerId: questions[index].correctAnswer,
        filePath: value?.path,
      };
    });

    const finalExamDetails = {
      name: examDetails.name,
      duration: examDetails.duration,
      questionsCount: questions.length,
      questions: JSON.stringify(questionDetails),
    };

    const result = await ExamService.createExam(finalExamDetails);

    if (result) {
      toast.success("Yeni imtahan uğurla yaradıldı");
      navigate("/exams");
    }
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
    setActiveDialog(AvailableDialogs.Confirmation);
    // setQuestions([]);
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
                          Sual yükləyin
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
                          {questions.map((question) => (
                            <SortableItem
                              key={question.id}
                              question={question}
                              removePendingQuestion={removePendingQuestion}
                              updateCorrectAnswer={updateCorrectAnswer}
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
                  disabled={questions.length === 0}
                >
                  Sualları sil {questions.length ? `(${questions.length})` : ""}
                  <Eraser />
                </Button>
                <Button type='submit' disabled={!creationAllowed}>
                  {isEditMode ? "Yadda saxla" : "Yarat"}
                  <CircleChevronRight />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const SortableItem = React.memo(function SortableItem({
  question,
  removePendingQuestion,
  updateCorrectAnswer,
}) {
  const { id } = question;
  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (question.file) {
      const url = URL.createObjectURL(question.file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (question.filePath) {
      const fetchImage = async () => {
        const data = await StorageService.getFile(question.filePath);
        if (data) {
          setImageUrl(data.publicUrl);
        }
      };
      fetchImage();
    }
  }, [question]);

  const style = useMemo(() => {
    const defaultOptions = {
      transform: CSS.Transform.toString(transform),
      transition: `opacity 200ms ease, ${transition}`,
      touchAction: "none",
      zIndex: 1,
      backdropFilter: "none",
    };

    if (active?.id === id) {
      return {
        ...defaultOptions,
        zIndex: 1000,
        backdropFilter: "blur(4px)",
        opacity: "1",
      };
    } else if (active) {
      return {
        ...defaultOptions,
        opacity: "0.9",
      };
    }

    return defaultOptions;
  }, [transform, transition, active, id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='relative border rounded-lg p-4 flex items-center'
    >
      <button
        type='button'
        onClick={() => removePendingQuestion(question.id)}
        className='absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200'
      >
        <X className='w-4 h-4 text-red-600' />
      </button>

      <div
        {...listeners}
        {...attributes}
        className='drag-handle mr-2 absolute bottom-2 right-2 p-1 rounded-full'
      >
        <GripVertical className='w-5 h-5 text-gray-500 cursor-grab' />
      </div>
      {imageUrl ? (
        <img src={imageUrl} alt='Question' className='question-image' />
      ) : (
        <p>Loading image...</p>
      )}
      <div>
        <select
          value={question.correctAnswer}
          onChange={(e) => updateCorrectAnswer(question.id, e.target.value)}
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white'
        >
          {answerOptions.map((answer) => {
            return <option key={answer}>{answer}</option>;
          })}
        </select>
      </div>
    </div>
  );
});

const answerOptions = ["A", "B", "C", "D", "E"];
