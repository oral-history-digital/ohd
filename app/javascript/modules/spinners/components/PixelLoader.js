export default function PixelLoader() {
    return (
        <div className="PixelLoader">
            <div className="PixelLoader-inner">
                {[...new Array(100)].map((_, index) => (
                    <div key={index} className="PixelLoader-pixel" />
                ))}
            </div>
        </div>
    );
}
