import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import monsterImg from "../assets/monster.png";

const dataStory = [
  {
    background: "day",
    character: "valak",
    text: "You stand at the edge of the Whispering Woods, sunlight dapping through the leaves. An ancient map, clutched tightly in your hand, promises untold riches hidden deep within. A weathered sign warns of perilous trials, but the lure of adventure is too strong to resist. You take your first step into the shadowed path, the air growing cooler as Valak's shadowy figure fades into the surrounding trees. Your heart pounding with anticipation.",
    type: "scene",
    challange: "false",
  },
  {
    type: "challenge",
    challengeText: "what is ur fav food?",
    options: ["me", "apple", "banana", "cherry"],
    correctAnswer: "me",
  },
  {
    background: "day",
    character: "monster",
    text: "The path winds deeper, leading you to a crystal-clear stream. As you reach down to take a sip, a grotesque monster emerges from the water, its eyes fixed on you. It lets out a terrifying roar. You step back, drawing your sword. This is it – the first trial.",
    type: "scene",
    challange: "true",
  },
  {
    background: "night",
    character: "monster",
    text: "The battle is fierce. The monster lundges, but you dodge, your sword finding its mark. It claws and bites, but you hold your ground, remembering all of your training. Finally, with a mighty blow, you defeat the beast. Exhausted, you collapse to the ground, victorious.",
    type: "scene",
    challange: "false",
  },
  {
    background: "day",
    character: "valak",
    text: "After resting, you continue your journey, following the map's cryptic clues. You pass through dense thickets and over rocky terrain, always vigilant. As you approach the final location. Valak appears once more, a sinister smile playing on her lips. She says, 'Almost there, are you not?'.",
    type: "scene",
    challange: "false",
  },
  {
    background: "day",
    character: "valak",
    text: "You reach the heart of the Woods - a hidden clearing bathed in golden sunlight. An ancient chest sits in the center, overflowing with glittering coins and priceless artifacts. You have done it. You have faced the trials, conquered the challenges, and found the treasure. As you lift a handful of gold, a sense of accomplishment washes over you. The adventure was worth it and Valak fades away with a wicked smile.",
    type: "scene",
    challange: "false",
  },
];

const QuestionPage = () => {
  const navigate = useNavigate();

  // const getUser = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/user/${userId}`);
  //     if (!response.ok) {
  //       throw new Error("NETWORK_ERROR");
  //     }
  //     const userData = await response.json();
  //     setUserData(userData.user);
  //   } catch (error) {
  //     console.error("Failed to fetch user data:", error);
  //   }
  // };

  const index = 1;
  function getImageUrl(name: string | undefined) {
    if (name === undefined) return;
    return new URL(`../assets/${name}.png`, import.meta.url).href;
  }

  // 2. Use the function in your component
  const monsterName = dataStory[index + 1].character; // This can be dynamic (e.g., from state)
  const monsterImg = getImageUrl(monsterName);

  const nextPage = (opt_index: number) => {
    if (
      dataStory[index].options[opt_index] === dataStory[index].correctAnswer
    ) {
      navigate(`/dialogue/${index + 1}/`);
    } else {
      navigate(`/dialogue/${index - 1}/`);
    }
  };

  return (
    <div className="flex flex-col relative items-center justify-center h-screen w-screen text-xl gap-2">
      <img src={monsterImg} className="absolute h-[80%]" />
      <div className="flex p-8 max-w-full h-full">
        <Container
          className="px-5"
          children={
            <div className="relative flex flex-col items-center justify-center h-full gap-5">
              <p className="font-bold text-2xl">
                {dataStory[index].challengeText}
              </p>

              <div className="grid grid-cols-2 items-center justify-center gap-2">
                <Button
                  text={dataStory[index].options[0]}
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {
                    nextPage(0);
                  }}
                />
                <Button
                  text={dataStory[index].options[1]}
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {
                    nextPage(1);
                  }}
                />
                <Button
                  text={dataStory[index].options[2]}
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {
                    nextPage(2);
                  }}
                />
                <Button
                  text={dataStory[index].options[3]}
                  className="w-full h-full text-2xl flex-1"
                  onClick={() => {
                    nextPage(3);
                  }}
                />
              </div>
              <div className="absolute bottom-2 left-0 flex flex-row text-center items-center">
                <img src={monsterImg} width={100} height={100} />
                <p className="text-center"> {monsterName} </p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default QuestionPage;
