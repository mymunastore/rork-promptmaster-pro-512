import { SavedPrompt } from '@/types/prompt';

const savedPrompts: SavedPrompt[] = [
  {
    id: '1',
    title: 'Tech Blog Post About AI Ethics',
    content: 'Write a comprehensive blog post about AI Ethics. Include an attention-grabbing introduction, 5 main points with supporting evidence, and a compelling conclusion. The tone should be informative yet accessible and target audience is tech professionals and ethicists. Include YES statistics and research.',
    category: 'writing',
    tags: ['AI', 'ethics', 'technology'],
    createdAt: '2025-07-25T14:48:00.000Z',
    updatedAt: '2025-07-25T14:48:00.000Z',
    isFavorite: true
  },
  {
    id: '2',
    title: 'Marketing Email for Summer Sale',
    content: 'Create a marketing email for our summer sale that will engage young professionals. The email should be enthusiastic and include emojis and a strong call to action. The goal of this email is to increase sales by 15% during the promotion period.',
    category: 'marketing',
    tags: ['email', 'sale', 'summer'],
    createdAt: '2025-07-20T09:23:00.000Z',
    updatedAt: '2025-07-20T09:23:00.000Z',
    isFavorite: false
  },
  {
    id: '3',
    title: 'React Component Documentation',
    content: 'Explain the following React component in simple terms:\n\n```jsx\nconst Button = ({ onClick, disabled, children, variant = "primary" }) => {\n  return (\n    <button\n      className={`btn btn-${variant}`}\n      onClick={onClick}\n      disabled={disabled}\n    >\n      {children}\n    </button>\n  );\n};\n```\n\nBreak down what each part does, explain any complex concepts, and suggest any potential improvements or best practices.',
    category: 'development',
    tags: ['React', 'component', 'documentation'],
    createdAt: '2025-07-18T16:12:00.000Z',
    updatedAt: '2025-07-18T16:12:00.000Z',
    isFavorite: true
  }
];

export default savedPrompts;