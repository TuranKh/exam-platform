import ImagePlaceholder from "/assets/placeholder.webp";
import CustomSelect from "@/components/FormBuilder/components/CustomSelect";
import RichTextEditor from "@/components/RichTextEditor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { selectAnswerOptions } from "@/lib/exam";
import StorageService from "@/service/StorageService";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader, Upload, X } from "lucide-react";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Exam.scss";

export const Question = React.memo(function SortableItem({
  question,
  removePendingQuestion,
  updateCorrectAnswer,
  index,
  uploadSingleImage,
  updateDescription,
}) {
  const { id } = question;
  const [imageLoading, setImageLoading] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition, active } =
    useSortable({ id });
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const showImage = useMemo(() => {
    return question.file || question.filePath;
  }, [question]);

  const onDescriptionChange = function (html: string) {
    updateDescription(index, html);
  };

  const triggerImageUpload = function () {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const uploadImage = function (e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    uploadSingleImage(file);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={question.id}
      className='relative border rounded-lg p-4 flex items-center'
    >
      <div className='drag-handle mr-2 absolute top-2 left-2 p-1 rounded-full'>
        Sual: {index + 1}
      </div>
      <button
        type='button'
        onClick={() => removePendingQuestion(index)}
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
      <img
        onLoad={() => {
          setImageLoading(false);
        }}
        src={imageUrl}
        style={{
          display: imageLoading ? "none" : "block",
        }}
        alt='Question'
        className='question-image'
      />
      {imageLoading && showImage && (
        <div className='flex justify-center items-center h-60'>
          <Loader className='animate-spin' />
        </div>
      )}
      {!showImage && (
        <div
          onClick={triggerImageUpload}
          className='relative group cursor-pointer rounded transition-transform hover:-translate-y-1'
        >
          <Upload
            size={40}
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     text-gray-500 transition-transform'
          />

          <img
            src={ImagePlaceholder}
            alt='placeholder'
            className='question-image'
          />
        </div>
      )}

      <input
        onChange={uploadImage}
        className='hidden'
        type='file'
        ref={fileInputRef}
      />
      <div>
        <CustomSelect
          formFieldDetails={{
            key: "correctAnswer",
            onChange: (details) => {
              updateCorrectAnswer(question.id, details.correctAnswer);
            },
            label: "Düzgün cavabı seçin",
            value: question?.correctAnswer,
          }}
          options={selectAnswerOptions}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <Alert>
          <AlertTitle>Diqqət</AlertTitle>
          <AlertDescription>
            Aşağıdaki hissə imtahan bitdikdən sonra görsənəcək
          </AlertDescription>
        </Alert>
        <RichTextEditor
          initialValue={question.description}
          onChange={onDescriptionChange}
        />
      </div>
    </div>
  );
});
