'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { handleGenerateArticle, handleGenerateIllustration } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, Image as ImageIcon, Download, Share2 } from 'lucide-react';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

export default function Home() {
  const { toast } = useToast();

  const [articleState, articleFormAction] = useFormState(handleGenerateArticle, { message: null, data: null, error: null });
  const [illustrationState, illustrationFormAction] = useFormState(handleGenerateIllustration, { message: null, data: null, error: null });

  React.useEffect(() => {
    if (articleState.message) {
      toast({ title: "Article Generation", description: articleState.message });
    }
    if (articleState.error) {
      toast({ title: "Article Generation Error", description: articleState.error, variant: "destructive" });
    }
  }, [articleState, toast]);

 React.useEffect(() => {
    if (illustrationState.message) {
      toast({ title: "Illustration Generation", description: illustrationState.message });
    }
    if (illustrationState.error) {
        toast({ title: "Illustration Generation Error", description: illustrationState.error, variant: "destructive" });
    }
  }, [illustrationState, toast]);


  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async (content: string, title: string) => {
     if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: content,
          });
          toast({ title: "Shared successfully!" });
        } catch (error) {
           console.error('Error sharing:', error);
           toast({ title: "Sharing failed", description: "Could not share content.", variant: "destructive" });
        }
      } else {
         toast({ title: "Share not supported", description: "Your browser does not support the Web Share API.", variant: "destructive" });
      }
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-8">
         <h1 className="text-3xl md:text-4xl font-bold text-center text-foreground w-full">
          ContentForge
         </h1>
       </div>

      <Tabs defaultValue="article" className="w-full max-w-3xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="article"><FileText className="mr-2 h-4 w-4" />Generate Article</TabsTrigger>
          <TabsTrigger value="illustration"><ImageIcon className="mr-2 h-4 w-4" />Generate Illustration</TabsTrigger>
        </TabsList>

        {/* Article Generation Tab */}
        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Generate Article</CardTitle>
              <CardDescription>Enter a topic to generate an article using Perplexity, Anthropic, and Hugging Face APIs.</CardDescription>
            </CardHeader>
            <form action={articleFormAction}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input id="topic" name="topic" placeholder="e.g., The future of renewable energy" required minLength={3} />
                </div>
                 {articleState.error && <p className="text-sm font-medium text-destructive">{articleState.error}</p>}
              </CardContent>
              <CardFooter>
                <SubmitButton>Generate Article</SubmitButton>
              </CardFooter>
            </form>
             {articleState.data?.article && (
                <CardContent className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-semibold mb-2">Generated Article</h3>
                   <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/40">
                     <pre className="whitespace-pre-wrap text-sm">{articleState.data.article}</pre>
                   </ScrollArea>
                   <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleDownload(articleState.data!.article, 'generated_article.txt')}>
                          <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare(articleState.data!.article, 'Generated Article')}>
                           <Share2 className="mr-2 h-4 w-4" /> Share
                      </Button>
                   </div>
                </CardContent>
             )}
          </Card>
        </TabsContent>

        {/* Illustration Generation Tab */}
        <TabsContent value="illustration">
          <Card>
            <CardHeader>
              <CardTitle>Generate Illustration</CardTitle>
              <CardDescription>Enter a prompt to generate illustrations using Pexels, Pixabay, and OpenAI Image APIs.</CardDescription>
            </CardHeader>
             <form action={illustrationFormAction}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea id="prompt" name="prompt" placeholder="e.g., A futuristic cityscape at sunset with flying cars" required minLength={3} />
                  </div>
                   {illustrationState.error && <p className="text-sm font-medium text-destructive">{illustrationState.error}</p>}
                </CardContent>
                <CardFooter>
                  <SubmitButton>Generate Illustration</SubmitButton>
                </CardFooter>
             </form>
             {(illustrationState.data?.pexelsImages?.length || illustrationState.data?.pixabayImages?.length) && (
                 <CardContent className="mt-6 border-t pt-6">
                   <h3 className="text-xl font-semibold mb-4">Generated Images</h3>
                    <ScrollArea className="h-96 w-full">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           {illustrationState.data?.pexelsImages?.map((image) => (
                             <div key={image.id} className="group relative aspect-video overflow-hidden rounded-md shadow-md">
                               <Image
                                 src={image.url || `https://picsum.photos/seed/${image.id}/300/200`} // Fallback placeholder
                                 alt={`Pexels Image by ${image.photographer}`}
                                 fill
                                 style={{ objectFit: 'cover' }}
                                 className="transition-transform duration-300 group-hover:scale-105"
                                 onError={(e) => e.currentTarget.src = `https://picsum.photos/seed/${image.id}/300/200`} // Handle broken image links
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                  <p className="text-xs text-white truncate">By {image.photographer}</p>
                               </div>
                               <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => image.url && handleDownload(image.url, `pexels_${image.id}.jpg`)}> <Download className="h-3 w-3" /></Button>
                                   <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => image.url && handleShare(image.url, `Pexels Image by ${image.photographer}`)}> <Share2 className="h-3 w-3" /></Button>
                                </div>
                             </div>
                           ))}
                           {illustrationState.data?.pixabayImages?.map((image) => (
                              <div key={image.id} className="group relative aspect-video overflow-hidden rounded-md shadow-md">
                               <Image
                                  src={image.url || `https://picsum.photos/seed/${image.id}/300/200`} // Fallback placeholder
                                  alt={`Pixabay Image by ${image.user}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  className="transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => e.currentTarget.src = `https://picsum.photos/seed/${image.id}/300/200`} // Handle broken image links
                                />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                  <p className="text-xs text-white truncate">By {image.user}</p>
                               </div>
                               <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => image.url && handleDownload(image.url, `pixabay_${image.id}.jpg`)}> <Download className="h-3 w-3" /></Button>
                                   <Button variant="secondary" size="icon" className="h-6 w-6" onClick={() => image.url && handleShare(image.url, `Pixabay Image by ${image.user}`)}> <Share2 className="h-3 w-3" /></Button>
                                </div>
                             </div>
                           ))}
                           {/* Placeholder for OpenAI Image API results if implemented */}
                           {/* {illustrationState.data?.openAIImages?.map(...)} */}
                      </div>
                     </ScrollArea>
                 </CardContent>
             )}
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
