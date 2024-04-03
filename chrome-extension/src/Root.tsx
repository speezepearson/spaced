import { useState } from "react";
import BaseMarkdown from "react-markdown";
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

function Markdown({ children, remarkPlugins, rehypePlugins, ...props }: {
    children: string,
    remarkPlugins?: typeof remarkMath[],
    rehypePlugins?: typeof rehypeKatex[],
    [key: string]: unknown
}) {
    return <BaseMarkdown
        remarkPlugins={remarkPlugins?.includes(remarkMath) ? remarkPlugins : [remarkMath, ...(remarkPlugins ?? [])]}
        rehypePlugins={rehypePlugins?.includes(rehypeKatex) ? rehypePlugins : [rehypeKatex, ...(rehypePlugins ?? [])]}
        {...props}>{children}</BaseMarkdown>
}

export function Root() {
    const [questionMarkdown, setQuestionMarkdown] = useState('');
    const [answerMarkdown, setAnswerMarkdown] = useState('');
    const create = useMutation(api.cards.create)

    return <form onSubmit={e => {
        e.preventDefault();
        (async () => {
            await create({ questionMarkdown, answerMarkdown })
            window.close();
        })().catch(console.error)
        return false;
    }}>
        <textarea className="form-control" value={questionMarkdown} onChange={e => { setQuestionMarkdown(e.target.value) }} autoFocus placeholder="Question"></textarea>
        <textarea className="form-control" value={answerMarkdown} onChange={e => { setAnswerMarkdown(e.target.value) }} placeholder="Answer"></textarea>
        <button className="btn btn-primary" type="submit">Submit</button>
        <hr />
        Preview:
        <div className="m-2 p-2 card">
            <Markdown>{questionMarkdown}</Markdown>
            <hr />
            <Markdown>{answerMarkdown}</Markdown>
        </div>
    </form>
}

// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('submit').addEventListener('click', function () {
//         var question = document.getElementById('question').value;
//         var answer = document.getElementById('answer').value;
//         var data = { questionMarkdown: question, answerMarkdown: answer };

//         fetch('https://hearty-lemming-243.convex.site/httpCreate', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//             .then(function (response) {
//                 if (response.ok) {
//                     window.close();
//                 } else {
//                     console.error('SRP: Error response:', response.status);
//                 }
//             })
//             .catch(function (error) {
//                 console.error('SRP: Error:', error);
//             });
//     });
// });