import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';

interface QnAFormData {
  name: string;
  email: string;
  question: string;
}

export default function QnAForm() {
  const [formData, setFormData] = useState<QnAFormData>({
    name: '',
    email: '',
    question: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/qna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Question submitted successfully",
          description: "We will get back to you soon.",
        });
        setFormData({ name: '', email: '', question: '' });
      } else {
        throw new Error('Failed to submit question');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "There was a problem submitting your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Ask a Question</CardTitle>
        <CardDescription className="text-center">
          Have any questions? Feel free to contact us anytime. We'll get back to you soon.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">
              Question *
            </label>
            <Textarea
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              required
              placeholder="Please describe your question in detail"
              className="w-full min-h-[120px] resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white"
            style={{ backgroundColor: 'hsl(122 39% 33%)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(122 52% 22%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(122 39% 33%)';
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
