import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Edit2 } from "lucide-react";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => void;
  type?: "text" | "email" | "select";
  options?: string[];
  placeholder?: string;
  className?: string;
}

export const EditableField = ({ 
  value, 
  onSave, 
  type = "text", 
  options = [], 
  placeholder,
  className = "" 
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div 
        className={`group flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1 ${className}`}
        onClick={() => setIsEditing(true)}
      >
        <span className="flex-1">{value}</span>
        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {type === "select" ? (
        <Select value={editValue} onValueChange={setEditValue}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="h-8"
          autoFocus
        />
      )}
      <Button size="sm" variant="ghost" onClick={handleSave}>
        <Check className="h-3 w-3 text-green-600" />
      </Button>
      <Button size="sm" variant="ghost" onClick={handleCancel}>
        <X className="h-3 w-3 text-red-600" />
      </Button>
    </div>
  );
};