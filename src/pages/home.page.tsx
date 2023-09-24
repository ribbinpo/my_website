import SocialList from "../components/social/social-list.component";
import profileImage from "../assets/images/example.png";

export default function HomePage() {
  return (
    <div className="px-28 grid grid-cols-5 min-w-max">
      <div className="col-span-2 flex justify-end">
        <img src={profileImage} alt="my profile" />
      </div>
      <div className="col-span-3 space-y-10">
        <div className="space-y-4">
          <p className="text-2xl">Hello, I'm Teerawut</p>
          <p className="text-5xl font-medium">
            Professional <br />
            Software Engineering
          </p>
        </div>
        <button className="bg-green-300 py-3 px-6 rounded-full font-medium">
          Download Portfolio
        </button>
        <hr className="w-3/5" />
        <div className="w-52">
          <SocialList />
        </div>
        {/* Scroll Down => position bottom right */}
      </div>
    </div>
  );
}
