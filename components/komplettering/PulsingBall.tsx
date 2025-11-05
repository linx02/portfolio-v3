const PulsingBall = ({ content }: { content?: string }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-blue-400 opacity-75"></div>
      <div className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
        <span className="text-sm font-medium">{content}</span>
      </div>
    </div>
  )
}
export default PulsingBall
