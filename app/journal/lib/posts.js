import data from "../data/posts.json";
export const posts = data;
export const summaries = posts.map(({ html, headings, ...summary }) => summary);
