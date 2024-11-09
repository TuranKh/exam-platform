import {
  CircleChevronRight,
  Eraser,
  GripVertical,
  Upload,
  X,
} from "lucide-react";
import React, { act, useEffect, useMemo, useState } from "react";

import "./CreateExam.scss";

import {
  closestCenter,
  DndContext,
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
import { Input } from "@/components/ui/input";
import { CSS } from "@dnd-kit/utilities";
import { AvailableDialogs, useVisualStore } from "@/store/VisualStore";

interface Question {
  id: string;
  file: File;
  correctAnswer: string | null;
}

export default function CreateExam() {
  const { setActiveDialog, closeDialog } = useVisualStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [creationAllowed, setCreationAllowed] = useState(false);

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

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    // Fetch questions from your backend
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newPendingQuestions = getNewFileDetails(files);
    setQuestions((prev) => [...prev, ...newPendingQuestions]);
  }

  const getNewFileDetails = function (files: File[]) {
    return files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      correctAnswer: null,
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
  }

  function handleDragEnd(event: any) {
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

  return (
    <div className='exam-wrapper'>
      <div>
        <h5>İmtahan yarat</h5>

        <div className='exam-details'>
          <Input id='exam-name' placeholder='İmtahanın adı' />
          <Input
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
                    <span className='text-sm text-gray-400'>Sual yükləyin</span>
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
                <h3 className='font-medium text-gray-900'>Pending Questions</h3>
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
              onClick={deleteQuestions}
              variant={"destructive"}
              disabled={questions.length === 0}
            >
              Sualları sil {questions.length && `(${questions.length})`}
              <Eraser />
            </Button>
            <Button
              variant={"secondary"}
              type='submit'
              disabled={!creationAllowed}
            >
              Yarat
              <CircleChevronRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
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

  const style = useMemo(() => {
    console.log(transition);
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

    // No dragging is happening
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
        className='drag-handle mr-2 absolute bottom-2 right-2 p-1  rounded-full'
      >
        <GripVertical className='w-5 h-5 text-gray-500 cursor-grab' />
      </div>
      <img
        src={URL.createObjectURL(question.file)}
        alt={`Question`}
        className='question-image'
      />
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
