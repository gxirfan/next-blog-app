import AboutPageComponent from "./_components/AboutPageComponent";

export const metadata = {
  title: "About",
  description:
    "Welcome to the world of " +
    process.env.PROJECT_NAME +
    ". Discover more about our next-generation content platform where you can share your thoughts and connect with writers in our network.",
};

export default function AboutPage() {
  return <AboutPageComponent />;
}
