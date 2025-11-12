'use client'

import * as React from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  value?: string[]
  onChange?: (files: string[]) => void
  maxFiles?: number
  accept?: string
  className?: string
}

export function FileUpload({
  value = [],
  onChange,
  maxFiles = 10,
  accept = 'image/*',
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<string[]>(value)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Максимум ${maxFiles} файлов`)
      return
    }

    // Convert to base64 for demo (in real app, upload to server)
    selectedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setFiles((prev) => {
          const updated = [...prev, base64]
          onChange?.(updated)
          return updated
        })
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      onChange?.(updated)
      return updated
    })
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Button */}
      <div
        onClick={handleClick}
        className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer"
      >
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Нажмите для загрузки фото</p>
        <p className="text-xs text-muted-foreground mt-1">
          До {maxFiles} файлов, максимум 5MB каждый
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={file}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
