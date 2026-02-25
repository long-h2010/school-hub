import { useState } from 'react';
import type { NewPost } from '../types/post';

export default function useNewPost() {
    const [newPost, setNewPost] = useState<NewPost | null>(null);

    const updatePost = <K extends keyof NewPost>(key: K, value: NewPost[K]) => {
        setNewPost((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const clearPost = () => {
        setNewPost(null);
    };

    return { newPost, setNewPost, updatePost, clearPost };
}
