import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, User, Clock, MessageSquare, Send } from 'lucide-react';
import { type QnaSubmission } from '@shared/schema';

interface QnADetailProps {
  question: QnaSubmission;
  onBack: () => void;
  onAnswerSubmitted: () => void;
}

export default function QnADetail({ question, onBack, onAnswerSubmitted }: QnADetailProps) {
  const [answer, setAnswer] = useState(question.answer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "Please enter an answer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/qna/${question.id}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer: answer.trim() }),
      });

      if (response.ok) {
        toast({
          title: "Answer saved successfully",
          description: "An email will be sent to the questioner.",
        });
        onAnswerSubmitted();
      } else {
        throw new Error('Failed to save answer');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "There was a problem saving the answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to List</span>
        </Button>
        <div className="flex items-center space-x-2">
          <Badge variant={question.isAnswered ? "default" : "secondary"}>
            {question.isAnswered ? "Answered" : "Pending"}
          </Badge>
          {question.answeredAt && (
            <span className="text-sm text-gray-500">
              Answered: {formatDate(question.answeredAt)}
            </span>
          )}
        </div>
      </div>

      {/* Question Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Question Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-gray-900">{question.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-gray-900">{question.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">Submitted</p>
              <p className="text-gray-900">{formatDate(question.createdAt)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Question</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{question.question}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Write Answer</CardTitle>
          <CardDescription>
            Please write an answer to the question. The answer will be sent to the questioner via email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Answer *
            </label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Please write your answer to the question..."
              className="min-h-[200px] resize-none"
            />
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !answer.trim()}
              className="flex items-center space-x-2 text-white"
              style={{ backgroundColor: 'hsl(122 39% 33%)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(122 52% 22%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'hsl(122 39% 33%)';
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
