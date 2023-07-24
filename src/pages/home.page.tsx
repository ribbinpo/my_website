export default function HomePage() {
  return (
    <div className="px-24 grid grid-cols-5">
      <div className="col-span-2 bg-red-300">Image</div>
      <div className="col-span-3 bg-orange-400">
        <p>Hello, I'm Teerawut</p>
        <p>Professional Software Engineering</p>
        <button className="bg-green-300">Download Portfolio</button>
        <hr />
        <p>social icon</p>
        {/* Scroll Down => position bottom right */}
      </div>
    </div>
  );
}
