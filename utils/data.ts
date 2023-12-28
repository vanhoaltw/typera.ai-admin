import { safeParse } from './common';

export const combineQuestions = (questions: string, files: { [x: string]: string }) => {
    const list = safeParse(questions);
    if (Array.isArray(list)) {
        return list.map((i) => ({ ...i, url: files[i?.image_id] }));
    } else {
        return [];
    }
};
