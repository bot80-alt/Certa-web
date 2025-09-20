import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoAnalysis from "./userInput Functions/VideoAnalysis";
import AudioAnalysis from "./userInput Functions/AudioAnalysis";
import ImageAnalysis from "./userInput Functions/ImageAnalysis";
import TextAnalysis from "./userInput Functions/TextAnalysis";
import NewsUrlAnalysis from "./userInput Functions/NewsUrlAnalysis";

export default function UserInput() {
  return (
    <div className="container mx-auto p-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Content Verification</h1>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-4 mb-4 bg-gray-900 p-4 rounded-lg h-auto">
          <TabsTrigger
            value="text"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Text Input
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            News URL
          </TabsTrigger>
          <TabsTrigger
            value="video"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Video Analysis
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Image Analysis
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="p-2 bg-gray-800 text-white hover:bg-gray-700 data-[state=active]:bg-blue-600"
          >
            Audio Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="w-full">
            <TextAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="url">
          <div className="w-full">
            <NewsUrlAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="video">
          <div className="w-full">
            <VideoAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="image">
          <div className="w-full">
            <ImageAnalysis />
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="w-full">
            <AudioAnalysis />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
