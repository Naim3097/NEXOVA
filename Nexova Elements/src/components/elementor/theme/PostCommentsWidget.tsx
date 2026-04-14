import React from 'react';

interface Comment {
  id: number | string;
  author: string;
  date: string;
  content: string;
  avatar?: string;
}

interface PostCommentsWidgetProps {
  comments?: Comment[];
  skin?: 'theme' | 'minimal';
}

export default function PostCommentsWidget({ 
  comments = [
    { id: 1, author: "User Name 1", date: "2 days ago", content: "This is a sample comment. Great article! I really enjoyed reading about this topic." },
    { id: 2, author: "User Name 2", date: "3 days ago", content: "Very informative, thanks for sharing." },
    { id: 3, author: "User Name 3", date: "1 week ago", content: "I have a question about the second point..." },
  ],
  skin = 'theme' 
}: PostCommentsWidgetProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-6">{comments.length} Comments</h3>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className={`flex gap-4 ${skin === 'minimal' ? 'border-b pb-4' : 'bg-gray-50 p-4 rounded-lg'}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
              {comment.avatar && <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>
              <p className="text-sm text-gray-600">
                {comment.content}
              </p>
              <button className="text-xs text-blue-600 mt-2 font-medium">Reply</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="font-bold mb-4">Leave a Comment</h4>
        <textarea 
          className="w-full border border-gray-300 rounded-md p-3 h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your comment here..."
        />
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
          Post Comment
        </button>
      </div>
    </div>
  );
}
