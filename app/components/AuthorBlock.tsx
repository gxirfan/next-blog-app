import Link from "next/link";
import Image from "next/image";

interface AuthorBlockProps {
  username: string;
  nickname: string;
  role: string;
  avatarUrl: string | undefined;
}

const getRoleColor = (role: string): string => {
  if (role === "admin") return "adminColor";
  if (role === "moderator") return "moderatorColor";
  if (role === "writer") return "writerColor";
  return "userColor";
};

const AuthorBlock = ({
  username,
  nickname,
  role,
  avatarUrl,
}: AuthorBlockProps) => {
  const avatarUrlFinal = avatarUrl
    ? process.env.NEXT_PUBLIC_API_IMAGE_URL + avatarUrl
    : process.env.NEXT_PUBLIC_API_IMAGE_URL +
      "/images/user/avatars/default-avatar.png";

  return (
    <div className="flex items-center space-x-2">
      <Link
        href={`/user/${username}`}
        className="flex items-center space-x-2 group hover:underline"
      >
        <div className="w-10 h-10 relative">
          <Image
            src={avatarUrlFinal}
            alt={`${nickname}'s avatar`}
            fill={true}
            className="rounded-full border border-cyan-800 object-cover"
          />
        </div>
        <span className={`font-semibold text-white`}>@{nickname}</span>
      </Link>
      {role.toLowerCase() !== "user" && (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
            role,
          )} bg-neutral-950 select-none`}
        >
          {role.toUpperCase()}
        </span>
      )}
    </div>
  );
};

export default AuthorBlock;
