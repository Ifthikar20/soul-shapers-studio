// ============================================
// FILE: src/components/progress/CreateGoalDialog.tsx
// Goal Creation Dialog Component
// ============================================

import React, { useState } from 'react';
import { progressService } from '@/services/progress.service';
import type { GoalType } from '@/types/progress.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated?: () => void;
}

const GOAL_TEMPLATES = [
  {
    type: 'daily_meditation' as GoalType,
    name: 'Daily Meditation',
    description: 'Meditate every day',
    defaultTarget: 1,
    unit: 'sessions',
    icon: '🧘',
    color: 'purple',
  },
  {
    type: 'weekly_sessions' as GoalType,
    name: 'Weekly Sessions',
    description: 'Complete meditation sessions this week',
    defaultTarget: 5,
    unit: 'sessions',
    icon: '🎯',
    color: 'blue',
  },
  {
    type: 'meditation_minutes' as GoalType,
    name: 'Meditation Minutes',
    description: 'Total meditation time',
    defaultTarget: 60,
    unit: 'minutes',
    icon: '⏱️',
    color: 'green',
  },
  {
    type: 'streak_days' as GoalType,
    name: 'Build a Streak',
    description: 'Maintain a consecutive day streak',
    defaultTarget: 7,
    unit: 'days',
    icon: '🔥',
    color: 'orange',
  },
  {
    type: 'complete_course' as GoalType,
    name: 'Complete Courses',
    description: 'Finish learning courses',
    defaultTarget: 1,
    unit: 'courses',
    icon: '📚',
    color: 'indigo',
  },
];

const CreateGoalDialog: React.FC<CreateGoalDialogProps> = ({
  open,
  onOpenChange,
  onGoalCreated,
}) => {
  const [selectedType, setSelectedType] = useState<GoalType>('weekly_sessions');
  const [target, setTarget] = useState('5');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectedTemplate = GOAL_TEMPLATES.find(t => t.type === selectedType);

  const handleCreate = async () => {
    if (!selectedTemplate) return;

    const targetNum = parseInt(target);
    if (isNaN(targetNum) || targetNum <= 0) {
      toast({
        title: 'Invalid Target',
        description: 'Please enter a valid target number',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await progressService.createGoal({
        type: selectedType,
        target: targetNum,
        deadline: deadline || undefined,
      });

      toast({
        title: 'Goal Created!',
        description: `Your ${selectedTemplate.name} goal has been created.`,
      });

      onOpenChange(false);
      onGoalCreated?.();

      // Reset form
      setSelectedType('weekly_sessions');
      setTarget('5');
      setDeadline('');
    } catch (error: any) {
      toast({
        title: 'Failed to Create Goal',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a personal goal to stay motivated on your wellness journey
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Goal Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="goal-type">Goal Type</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value as GoalType);
                const template = GOAL_TEMPLATES.find(t => t.type === value);
                if (template) {
                  setTarget(template.defaultTarget.toString());
                }
              }}
            >
              <SelectTrigger id="goal-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GOAL_TEMPLATES.map(template => (
                  <SelectItem key={template.type} value={template.type}>
                    <div className="flex items-center gap-2">
                      <span>{template.icon}</span>
                      <span>{template.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
            )}
          </div>

          {/* Target */}
          <div className="space-y-2">
            <Label htmlFor="target">Target</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="target"
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[80px]">
                {selectedTemplate?.unit}
              </span>
            </div>
          </div>

          {/* Deadline (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Goal Preview */}
          {selectedTemplate && (
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedTemplate.icon}</span>
                <div>
                  <div className="font-semibold">{selectedTemplate.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Target: {target} {selectedTemplate.unit}
                    {deadline && ` by ${new Date(deadline).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Goal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalDialog;
