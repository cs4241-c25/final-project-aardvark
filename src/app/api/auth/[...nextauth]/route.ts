import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { v4 as uuidv4 } from "uuid";

const authOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Credentials({
      name: "anonymous",
      credentials: {},
      async authorize() {
        return createAnonymousUser();
      },
    }),
  ],
};

const createAnonymousUser = () => {
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Black",
    "White",
    "Gray",
  ];
  const animals = [
    "Aardvark",
    "Tiger",
    "Eagle",
    "Dolphin",
    "Panda",
    "Wolf",
    "Cheetah",
    "Falcon",
    "Otter",
    "Lynx",
  ];

  const getRandomElement = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];
  const getRandomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const uuid = uuidv4();
  const randomName = `${getRandomElement(colors)}-${getRandomElement(
    animals
  )}-${getRandomNumber(1, 99)}`;

  return {
    id: uuid,
    name: randomName,
    email: `anonymous_${uuid}`,
    // using image as a way to identify anonymous users
    image: "anonymous",
  };
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
