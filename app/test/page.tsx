import BookItem from "@/components/BookItem";

const formats = ["txt", "wav", "avi", "doc", "jpg", "jpg"];
const app = () => {
    return (
        <div>
            {Array(10)
                .fill("")
                .map((_, i) => {
                    return {
                        title: `Item ${i}`,
                        author: `Item ${i} :D`,
                        font: `Item ${i} :D`,
                        size: `Item ${i} :D`,
                        sizeByBytes: `Item ${i} :D`,
                        format: "."+ formats[
                            Math.floor(Math.random() * formats.length - 1)
                        ],
                        link: `Item ${i} :D`,
                        bookId: `Item ${i} :D`
                    };
                })
                .map((book, i) => {
                    return <BookItem key={i} book={book} />;
                })}
        </div>
    );
};

export default app;
