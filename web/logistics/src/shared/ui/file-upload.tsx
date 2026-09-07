'use client';

import { useEffect, useState } from 'react';

import { FileIcon } from '@untitledui/file-icons';
import {
  CircleAlertIcon,
  CloudUploadIcon,
  DownloadIcon,
  FileIcon as FileLucideIcon,
  PlusIcon,
  RefreshCwIcon,
  Trash2Icon,
  UploadIcon,
  UserIcon,
  XIcon,
} from 'lucide-react';

import {
  type FileCategory,
  type FileMetadata,
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from '@/shared/hooks/use-file-upload';

import { cn } from '@/shared/lib/utils';

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

type FileIconType = React.ComponentProps<typeof FileIcon>['type'];

const FILE_CATEGORY_META: Record<
  FileCategory,
  { icon: FileIconType; label: string }
> = {
  image: { icon: 'image', label: 'Image' },
  video: { icon: 'video', label: 'Video' },
  audio: { icon: 'audio', label: 'Audio' },
  pdf: { icon: 'pdf', label: 'PDF' },
  doc: { icon: 'doc', label: 'Word' },
  docx: { icon: 'docx', label: 'Word' },
  xls: { icon: 'xls', label: 'Excel' },
  xlsx: { icon: 'xlsx', label: 'Excel' },
  archive: { icon: 'zip', label: 'Archive' },
  json: { icon: 'json', label: 'JSON' },
  text: { icon: 'txt', label: 'Text' },
  file: { icon: 'document', label: 'File' },
};

const getFileCategory = (file: File | FileMetadata): FileCategory => {
  const { type } = file;

  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf')) return 'pdf';
  if (type.includes('wordprocessingml')) return 'docx'; // .docx
  if (type.includes('msword')) return 'doc'; // legacy .doc
  if (type.includes('spreadsheetml')) return 'xlsx'; // .xlsx
  if (type.includes('ms-excel')) return 'xls'; // legacy .xls
  if (type.includes('zip') || type.includes('rar')) return 'archive';
  if (type.includes('json')) return 'json';
  if (type.includes('text')) return 'text';

  return 'file';
};

const getFileIcon = (file: File | FileMetadata) => {
  const { icon } = FILE_CATEGORY_META[getFileCategory(file)];
  return <FileIcon type={icon} variant="default" className="size-5" />;
};

const getFileTypeLabel = (file: File | FileMetadata) =>
  FILE_CATEGORY_META[getFileCategory(file)].label;

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

export function AvatarUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: 'image/*',
    multiple: false,
    onFilesChange: (files) => {
      onFileChange?.(files[0] || null);
    },
  });

  const currentFile = files[0];
  const previewUrl = currentFile?.preview || defaultAvatar;

  const handleRemove = () => {
    if (currentFile) {
      removeFile(currentFile.id);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Avatar Preview */}
      <div className="relative">
        <div
          className={cn(
            'group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/20',
            previewUrl && 'border-solid',
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserIcon className="text-muted-foreground size-6" />
            </div>
          )}
        </div>

        {/* Remove Button - only show when file is uploaded */}
        {currentFile && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleRemove}
            className="absolute inset-e-0.5 top-0.5 z-10 size-6 rounded-full dark:bg-zinc-800 hover:dark:bg-zinc-700"
            aria-label="Remove avatar"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="space-y-0.5 text-center">
        <p className="text-sm font-medium">
          {currentFile ? 'Avatar uploaded' : 'Upload avatar'}
        </p>
        <p className="text-muted-foreground text-xs">
          PNG, JPG up to {formatBytes(maxSize)}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface TableUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
}

export function TableUpload({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: TableUploadProps) {
  // Create default files using FileMetadata type
  const defaultFiles: FileMetadata[] = [
    {
      id: 'default-doc-1',
      name: 'document.pdf',
      size: 529254,
      type: 'application/pdf',
      url: '/media/files/document.pdf',
    },
    {
      id: 'default-doc-2',
      name: 'intro.zip',
      size: 252846,
      type: 'application/zip',
      url: '/media/files/intro.zip',
    },
    {
      id: 'default-doc-3',
      name: 'conclusion.xlsx',
      size: 353126,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      url: '/media/files/conclusion.xlsx',
    },
    {
      id: 'default-doc-4',
      name: 'package.json',
      size: 697,
      type: 'application/json',
      url: '/media/files/package.json',
    },
  ];

  // Convert default files to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultFiles.map((file) => ({
    id: file.id,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    } as File,
    preview: file.url,
    progress: 100,
    status: 'completed' as const,
  }));

  const [uploadFiles, setUploadFiles] =
    useState<FileUploadItem[]>(defaultUploadFiles);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultFiles,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id,
        );

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress >= 100) {
            // Randomly decide if upload succeeds or fails
            const shouldFail = Math.random() < 0.1; // 10% chance to fail
            return {
              ...file,
              progress: 100,
              status: shouldFail ? ('error' as const) : ('completed' as const),
              error: shouldFail
                ? 'Upload failed. Please try again.'
                : undefined,
            };
          }

          return { ...file, progress: newProgress };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: 'uploading' as const,
              error: undefined,
            }
          : file,
      ),
    );
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-6 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'bg-muted flex h-12 w-12 items-center justify-center rounded-full transition-colors',
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25',
            )}
          >
            <UploadIcon className="text-muted-foreground h-5 w-5" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drop files here or{' '}
              <button
                type="button"
                onClick={openFileDialog}
                className="text-primary cursor-pointer underline-offset-4 hover:underline"
              >
                browse files
              </button>
            </p>
            <p className="text-muted-foreground text-xs">
              Maximum file size: {formatBytes(maxSize)} • Maximum files:{' '}
              {maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Files Table */}
      {uploadFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Files ({uploadFiles.length})
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={openFileDialog}
                variant="outline"
                size="sm"
                type="button"
              >
                <CloudUploadIcon className="h-4 w-4" />
                Add files
              </Button>
              <Button
                onClick={clearFiles}
                variant="outline"
                size="sm"
                type="button"
              >
                <Trash2Icon className="h-4 w-4" />
                Remove all
              </Button>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="h-9 ps-4">Name</TableHead>
                  <TableHead className="h-9">Type</TableHead>
                  <TableHead className="h-9">Size</TableHead>
                  <TableHead className="h-9 w-25 ps-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadFiles.map((fileItem) => (
                  <TableRow key={fileItem.id}>
                    <TableCell className="py-2 ps-1.5">
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            'text-muted-foreground/80 relative flex size-8 shrink-0 items-center justify-center',
                          )}
                        >
                          {fileItem.status === 'uploading' ? (
                            <div className="relative">
                              {/* Circular progress background */}
                              <svg
                                className="size-8 -rotate-90"
                                viewBox="0 0 32 32"
                              >
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-muted-foreground/20"
                                />
                                {/* Progress circle */}
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeDasharray={`${2 * Math.PI * 14}`}
                                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - fileItem.progress / 100)}`}
                                  className="text-primary transition-all duration-300"
                                  strokeLinecap="round"
                                />
                              </svg>
                              {/* File icon in center */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                {getFileIcon(fileItem.file)}
                              </div>
                            </div>
                          ) : (
                            <div className="not-[]:size-8 flex items-center justify-center">
                              {getFileIcon(fileItem.file)}
                            </div>
                          )}
                        </div>
                        <p className="flex items-center gap-1 truncate text-sm font-medium">
                          {fileItem.file.name}
                          {fileItem.status === 'error' && (
                            <Badge variant="destructive" size="sm">
                              Error
                            </Badge>
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(fileItem.file)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2 text-sm">
                      {formatBytes(fileItem.file.size)}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        {fileItem.preview && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            type="button"
                          >
                            <DownloadIcon className="size-3.5" />
                          </Button>
                        )}
                        {fileItem.status === 'error' ? (
                          <Button
                            onClick={() => retryUpload(fileItem.id)}
                            variant="ghost"
                            size="icon"
                            className="text-destructive/80 hover:text-destructive size-8"
                            type="button"
                          >
                            <RefreshCwIcon className="size-3.5" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => removeUploadFile(fileItem.id)}
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            type="button"
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface FileUploadCompactProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

export function CompactUpload({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024, // 2MB
  accept = 'image/*',
  multiple = true,
  className,
  onFilesChange,
}: FileUploadCompactProps) {
  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange,
  });

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };

  return (
    <div className={cn('w-full max-w-lg', className)}>
      {/* Compact Upload Area */}
      <div
        className={cn(
          'border-border rounded-lg flex items-center gap-3 border border-dashed p-4 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />
        {/* Upload Button */}
        <Button
          onClick={openFileDialog}
          size="sm"
          className={cn(isDragging && 'animate-bounce')}
        >
          <PlusIcon className="h-4 w-4" />
          Add files
        </Button>
        {/* File Previews */}
        <div className="flex flex-1 items-center gap-2">
          {files.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Drop files here or click to browse (max {maxFiles} files)
            </p>
          ) : (
            files.map((fileItem) => (
              <div key={fileItem.id} className="group/item relative shrink-0">
                {isImage(fileItem.file) && fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="h-12 w-12 rounded-lg border object-cover"
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  />
                ) : (
                  <div
                    className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg border"
                    title={`${fileItem.file.name} (${formatBytes(fileItem.file.size)})`}
                  >
                    <FileLucideIcon className="text-muted-foreground h-5 w-5" />
                  </div>
                )}
                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  variant="outline"
                  size="icon"
                  className="absolute -inset-4e-2 -top-2 size-5 rounded-full opacity-0 shadow-md transition-opacity group-hover/item:opacity-100"
                >
                  <XIcon className="size-3" />
                </Button>
              </div>
            ))
          )}
        </div>
        {/* File Count */}
        {files.length > 0 && (
          <div className="text-muted-foreground shrink-0 text-xs">
            {files.length}/{maxFiles}
          </div>
        )}
      </div>
      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
}

export function ProgressUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: ProgressUploadProps) {
  // Create default images using FileMetadata type
  const defaultImages: FileMetadata[] = [
    {
      id: 'default-3',
      name: 'image-1.png',
      size: 42048,
      type: 'image/png',
      url: 'https://picsum.photos/1000/800?grayscale&random=10',
    },
    {
      id: 'default-4',
      name: 'image-2.png',
      size: 62807,
      type: 'image/png',
      url: 'https://picsum.photos/1000/800?grayscale&random=11',
    },
  ];

  // Convert default images to FileUploadItem format
  const defaultUploadFiles: FileUploadItem[] = defaultImages.map((image) => ({
    id: image.id,
    file: {
      name: image.name,
      size: image.size,
      type: image.type,
    } as File,
    preview: image.url,
    progress: 100,
    status: 'completed' as const,
  }));

  const [uploadFiles, setUploadFiles] =
    useState<FileUploadItem[]>(defaultUploadFiles);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultImages,
    onFilesChange: (newFiles) => {
      // Convert to upload items when files change, preserving existing status
      const newUploadFiles = newFiles.map((file) => {
        // Check if this file already exists in uploadFiles
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id,
        );

        if (existingFile) {
          // Preserve existing file status and progress
          return {
            ...existingFile,
            ...file, // Update any changed properties from the file
          };
        } else {
          // New file - set to uploading
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          // Simulate occasional errors (10% chance when progress > 50%)
          if (newProgress > 50 && Math.random() < 0.99) {
            return {
              ...file,
              status: 'error' as const,
              error: 'Upload failed. Please try again.',
            };
          }

          // Complete when progress reaches 100%
          if (newProgress >= 100) {
            return {
              ...file,
              progress: 100,
              status: 'completed' as const,
            };
          }

          return {
            ...file,
            progress: newProgress,
          };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: 'uploading' as const,
              error: undefined,
            }
          : file,
      ),
    );
  };

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const completedCount = uploadFiles.filter(
    (f) => f.status === 'completed',
  ).length;
  const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
  const uploadingCount = uploadFiles.filter(
    (f) => f.status === 'uploading',
  ).length;

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'rounded-lg relative border border-dashed p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full',
              isDragging ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <UploadIcon
              className={cn(
                'h-6',
                isDragging ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload your files</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop files here or click to browse
            </p>
            <p className="text-muted-foreground text-xs">
              Support for multiple file types up to {formatBytes(maxSize)} each
            </p>
          </div>

          <Button type='button' onClick={openFileDialog}>
            <UploadIcon className="h-4 w-4" />
            Select files
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      {uploadFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Upload Progress</h4>
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge size="sm" variant="success">
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size="sm" variant="destructive">
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size="sm" variant="secondary">
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button onClick={clearFiles} variant="outline" size="sm" type='button'>
            Clear all
          </Button>
        </div>
      )}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadFiles.map((fileItem: FileUploadItem) => (
            <div
              key={fileItem.id}
              className="border-border bg-card rounded-lg border p-2.5"
            >
              <div className="flex items-start gap-2.5">
                {/* File Icon */}
                <div className="shrink-0">
                  {fileItem.preview &&
                  fileItem.file.type.startsWith('image/') ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="rounded-lg h-12 w-12 border object-cover"
                    />
                  ) : (
                    <div className="border-border text-muted-foreground rounded-lg flex h-12 w-12 items-center justify-center border">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <div className="mt-0.75 flex items-center justify-between">
                    <p className="inline-flex flex-col justify-center gap-1 truncate font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {formatBytes(fileItem.file.size)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Remove Button */}
                      <Button
                        onClick={() => removeUploadFile(fileItem.id)}
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground size-6 hover:bg-transparent hover:opacity-100"
                        type='button'
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <Alert variant="destructive" className="flex items-center my-1 p-2">
                      <CircleAlertIcon className="size-4" />
                      <AlertTitle className="text-xs">
                        {fileItem.error}
                      </AlertTitle>
                      <AlertAction>
                        <Button
                          onClick={() => retryUpload(fileItem.id)}
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground size-4 hover:bg-transparent hover:opacity-100"
                          type='button'
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                      </AlertAction>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
