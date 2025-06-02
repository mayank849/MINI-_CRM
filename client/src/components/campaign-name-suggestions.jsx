"use client";

import { useState, useEffect } from "react";
import { Loader2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateCampaignNameSuggestions } from "@/lib/gemini";

export function CampaignNameSuggestions({ rules, ruleOperator, onSelectName }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setSuggestions([]);
    setShowSuggestions(false);
  }, [rules, ruleOperator]);

  const handleGenerateSuggestions = async () => {
    if (rules.length === 0) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(true);

    try {
      const names = await generateCampaignNameSuggestions(rules, ruleOperator);
      setSuggestions(names);
    } catch (err) {
      console.error("Error generating name suggestions:", err);
      setError("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (rules.length === 0) {
    return null;
  }

  if (!showSuggestions) {
    return (
      <div className="mt-4">
        <Button
          variant="outline"
          onClick={handleGenerateSuggestions}
          className="flex items-center gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Suggest Campaign Names
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">AI-Suggested Campaign Names</CardTitle>
        <CardDescription>
          Based on your targeting rules, here are some name suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Generating suggestions...</span>
          </div>
        ) : error ? (
          <div className="text-destructive py-2">{error}</div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((name, index) => {
              const isObject = typeof name === "object" && name !== null;
              const title = isObject && typeof name.title === "string" ? name.title : String(name)
              const description = isObject ? name.description : "";

              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left flex flex-col items-start"
                  onClick={() => {
                    console.log("Selected title:", title);
                    onSelectName(title);
                  }}
                >
                  <span className="font-semibold">
                    {typeof title === "string" ? title : JSON.stringify(title)}
                  </span>

                  {description && (
                    <span className="text-sm text-muted-foreground">
                      {description}
                    </span>
                  )}
                </Button>
              );
            })}
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateSuggestions}
                className="flex items-center gap-2"
              >
                <Lightbulb className="h-4 w-4" />
                Generate More
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
