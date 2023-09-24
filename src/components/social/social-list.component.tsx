import SocialItem from "./social-item.component";
import { SocialContactList } from "../../configs/contact.config";

export default function SocialList() {
  return (
    <div className="flex space-x-6 min-w-36">
      {SocialContactList().map((social, key) => (
        <SocialItem icon={social.icons} key={key} />
      ))}
    </div>
  );
}
