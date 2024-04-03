import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ReqStatus, isWorking, watchReqStatus } from "../common";
import { List } from "immutable";
import BaseMarkdown from "react-markdown";
import { Doc } from "../../convex/_generated/dataModel";
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you

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

function CreateCardForm() {
    const createCard = useMutation(api.cards.create);
    const [questionMarkdown, setQuestionMarkdown] = useState("");
    const [answerMarkdown, setAnswerMarkdown] = useState("");
    const [status, setStatus] = useState<ReqStatus>({ type: 'idle' });

    return <form onSubmit={(e) => {
        e.preventDefault();
        if (isWorking(status)) return;
        watchReqStatus(setStatus, (async () => {
            await createCard({ questionMarkdown, answerMarkdown });
            setQuestionMarkdown("");
            setAnswerMarkdown("");
        })()).catch(console.error);
    }}>
        <div>
            <label>Question:</label>
            <textarea className="form-control" disabled={isWorking(status)} value={questionMarkdown} onChange={(e) => { setQuestionMarkdown(e.target.value) }} />
        </div>
        <div className="mt-2">
            <label>Answer:</label>
            <textarea className="form-control" disabled={isWorking(status)} value={answerMarkdown} onChange={(e) => { setAnswerMarkdown(e.target.value) }} />
        </div>
        <button className="btn btn-primary mt-2" disabled={isWorking(status)} type="submit">Create</button>
    </form>
}

function Review({ card, markReviewed }: { card: Doc<'cards'>, markReviewed: ({ nextReviewAtMillis }: { nextReviewAtMillis: number }) => Promise<unknown> }) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [markStatus, setMarkStatus] = useState<ReqStatus>({ type: 'idle' });

    // space between flex items
    return <div className="card p-2 m-2 d-flex flex-column" style={{ minHeight: '20em', justifyContent: 'space-between' }}>
        <div>
            <div><Markdown>{card.questionMarkdown}</Markdown></div>
            <hr />
            <div className={`${showAnswer ? 'visible' : 'invisible'}`}><Markdown>{card.answerMarkdown}</Markdown></div>
        </div>
        <div>
            {showAnswer
                ? <div>
                    {[
                        { text: 'now', cls: 'btn-danger', millis: 0 },
                        { text: '1d', cls: 'btn-primary', millis: 1000 * 60 * 60 * 24 },
                        { text: '1w', cls: 'btn-success', millis: 1000 * 60 * 60 * 24 * 7 }].map(({ text, cls, millis }) => (
                            <button key={text} className={`btn ${cls}`} disabled={isWorking(markStatus)} onClick={() => {
                                if (isWorking(markStatus)) return;
                                watchReqStatus(setMarkStatus, markReviewed({ nextReviewAtMillis: new Date().getTime() + millis }));
                            }}>{text}</button>
                        ))}
                </div>
                : <button className="btn btn-primary mt-2" onClick={() => setShowAnswer(true)}>Show Answer</button>
            }
        </div>
    </div>

}

export function Page() {
    const cardsQ = useQuery(api.cards.list);
    const markReviewed = useMutation(api.cards.markReviewed);

    if (cardsQ === undefined) {
        return <div>Loading...</div>
    }

    const cards = List(cardsQ).sortBy(c => c.nextReviewAtMillis);
    const cardsToReview = cards.filter(c => !c.nextReviewAtMillis || c.nextReviewAtMillis < Date.now());
    const firstCardToReview = cardsToReview.first();

    return <div>
        {firstCardToReview === undefined ? <div>You're caught up!</div> : <div>
            {cardsToReview.size} cards to review.
            <Review card={firstCardToReview} markReviewed={({ nextReviewAtMillis }) => markReviewed({ id: firstCardToReview._id, nextReviewAtMillis })} />
        </div>}
        <hr />
        <h1>
            Create a card
        </h1>
        <CreateCardForm />
    </div>
}