import { process } from '/env'
import { Configuration, OpenAIApi } from 'openai'

const setupTextarea = document.getElementById('setup-textarea')
const setupInputContainer = document.getElementById('setup-input-container')
const movieBossText = document.getElementById('movie-boss-text')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

document.getElementById("send-btn").addEventListener("click", () => {
  if (setupTextarea.value) {
    const userInput = setupTextarea.value
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">`
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...`
    fetchBotReply(userInput)
    fetchSynopsis(userInput)
  }
})

async function fetchBotReply(outline) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
/*
1. Refactor this prompt to use examples of an outline and an 
   enthusiastic response. Be sure to keep the length of your 
   examples reasonably short, say 20 words or so.
*/
    prompt: ```Generate a short message to enthusiastically say "${outline}" sounds interesting 
    and that you need some minutes to think about it. Mention one aspect of the sentence.
    ###
    outline: After Peter Parker is bitten by a genetically altered spider, he gains newfound, spider-like powers and ventures out to save the city from the machinations of a mysterious reptilian foe.
    message: Ooh, interesting! It sounds like the plot should have heroes and villains with animal-themed superpowers. Please wait a few minutes...
    ###
    ###
    outline: Peter Parker balances his life as an ordinary high school student in Queens with his superhero alter-ego Spider-Man, and finds himself on the trail of a new menace prowling the skies of New York City.
    message: Wow! It sounds like an enticing story about a teenager who secretly takes on the role of a superhero. Please wait a few minutes while I think...
    ```,
    max_tokens: 60 
  })
  movieBossText.innerText = response.data.choices[0].text.trim()
  console.log(response) 
} 

async function fetchSynopsis(outline) {
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `Generate an engaging, professional and marketable movie synopsis 
    based on a given outline. After the name of each character in your synopsis, 
    also write the name of a Hollywood actor that would be a good fit to play that 
    role. Surround each actor name in parenthesis.
    ###
    outline: After being bitten by a genetically-modified spider, a shy teenager gains spider-like abilities that he uses to fight injustice as a masked superhero and face a vengeful enemy.
    synopsis: Constantly picked on at school, insecure, brainy orphan Peter Parker (Tobey Maguire) can barely stand up for himself, let alone win the affection of Mary Jane Watson (Kirsten Dunst), 
    the beautiful red-head next door he adores. Then, one day, while on a school field trip at 
    a Columbia University laboratory, a genetically enhanced spider bites Peter, 
    and just like that, an extraordinary transformation occurs. Now, with his body undergoing 
    drastic changes, Peter gains distinct arachnid powers and phenomenal newfound 
    super-abilities, only to quickly realise that with great power comes great responsibility. 
    And, before long, the unhinged, unnaturally strong super-villain Green Goblin (Willem Dafoe) enters the 
    picture, more than willing to put Peter's moral mettle to the test. However, is Peter's 
    unexpected mutation a blessing or a curse? Will Peter Parker dedicate himself to fighting 
    crime as New York City's masked protector?
    ###
    outline: ${outline}
    synopsis: 
    `,
    max_tokens: 700
  }) 
  const synopsis = response.data.choices[0].text.trim()
  document.getElementById('output-text').innerText = synopsis
  fetchTitle(synopsis)
  fetchStars(synopsis)
}

async function fetchTitle(synopsis) {
/*
Challenge:
1. Write a prompt asking for a title based on a synopsis. 
   You can specify that the title should be gripping, or flashy, 
   or alluring if you would like. 
2. Add 'model' and 'max_tokens' properties. 
*/
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: ```You are an award-winning Hollywood screenwriter with over 20 years of experience. You are helping a gifted young director develop parts of their pitch for a new movie idea.
    Given a synopsis for a movie plot, generate an alluring, iconic title that will catch the eyes of film studios.
    ### 
    synopsis: Set in a future North America known as "Panem", the Capitol selects a boy and a girl between the ages of 12 and 18 from each of the twelve outlying districts to compete in the annual "Hunger Games", a televised fight-to-the-death. The film is centered around Katniss Everdeen - a 16-year-old girl from District 12, who volunteers for her 12-year-old sister, Prim, when Prim's name is chosen - and Katniss's fellow District 12 tribute, Peeta Mellark, with whom she has some rather dramatic history. Katniss is then rushed to the Capitol, where she undergoes intense training before being thrust into the arena to fight to become the victor of the seventy-fourth annual Hunger Games.
    title: The Hunger Games
    ### 
    synopsis: Following the events of Batman Begins (2005), mighty Batman, Lieutenant James Gordon, and District Attorney Harvey Dent plan to arrest shady mob accountant Lau to bring down the mob. But Lau's detailed disclosures threaten Gotham's organised crime. As a result, the city's desperate mob bosses turn to The Joker, a sadistic, green-haired psychopath in a purple suit with a flair for crime. As the unstoppable criminal mastermind wreaks havoc, bringing Gotham to its knees with widespread anarchy and chaos, Batman must face his greatest challenge to battle injustice. However, is the Dark Knight prepared to walk the fine line between defender and avenger, hero and vigilante?
    title: The Dark Knight
    ###
    synopsis: ${synopsis}
    title: 
    ```,
    max_tokens: 12,
  })
  const title = response.data.choices[0].text.trim()
  document.getElementById('output-title').innerText = title
  fetchImagePrompt(title, synopsis)
}


async function fetchStars(synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
/*
Challenge:
    1. Use OpenAI to extra the names in brackets from our synopsis.
*/
    prompt: ```Given a synopsis for a movie plot, please list the full names of all the actors it mentions (they are delimited by parentheses).
    ###
    synopsis: Constantly picked on at school, insecure, brainy orphan Peter Parker (Tobey Maguire) can barely stand up for himself, let alone win the affection of Mary Jane Watson (Kirsten Dunst), 
    the beautiful red-head next door he adores. Then, one day, while on a school field trip at 
    a Columbia University laboratory, a genetically enhanced spider bites Peter, 
    and just like that, an extraordinary transformation occurs. Now, with his body undergoing 
    drastic changes, Peter gains distinct arachnid powers and phenomenal newfound 
    super-abilities, only to quickly realise that with great power comes great responsibility. 
    And, before long, the unhinged, unnaturally strong super-villain Green Goblin (Willem Dafoe) enters the 
    picture, more than willing to put Peter's moral mettle to the test. However, is Peter's 
    unexpected mutation a blessing or a curse? Will Peter Parker dedicate himself to fighting 
    crime as New York City's masked protector?
    names: Tobey Maguire, Kirsten Dunst, Willem Dafoe
    ###
    synopsis: ${synopsis}
    names: 
    ```,
    max_tokens: 30
  })
  document.getElementById('output-stars').innerText = response.data.choices[0].text.trim()
}

async function fetchImagePrompt(title, synopsis){
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
/*
Challenge:
1. Write a prompt that will generate an image prompt that we can 
   use to get artwork for our movie idea.
⚠️ OpenAI has no knowledge of our characters. So the image prompt 
   needs descriptions not names!
2. Add temperature if you think it's needed.
*/
    prompt: ```You are a graphic artist living in Los Angeles. You have designed posters for several award-winning Hollywood films and are a massive film historian.
    You are helping a gifted young director develop parts of their pitch for a new movie idea.
    Given the proposed title and synopsis for a movie plot, generate an eye-catching description for a movie poster (that one of your subordinates could then go design).
    ### 
    title: Spider-Man
    synopsis:  Constantly picked on at school, insecure, brainy orphan Peter Parker (Tobey Maguire) can barely stand up for himself, let alone win the affection of Mary Jane Watson (Kirsten Dunst), 
    the beautiful red-head next door he adores. Then, one day, while on a school field trip at 
    a Columbia University laboratory, a genetically enhanced spider bites Peter, 
    and just like that, an extraordinary transformation occurs. Now, with his body undergoing 
    drastic changes, Peter gains distinct arachnid powers and phenomenal newfound 
    super-abilities, only to quickly realise that with great power comes great responsibility. 
    And, before long, the unhinged, unnaturally strong super-villain Green Goblin (Willem Dafoe) enters the 
    picture, more than willing to put Peter's moral mettle to the test. However, is Peter's 
    unexpected mutation a blessing or a curse? Will Peter Parker dedicate himself to fighting 
    crime as New York City's masked protector?
    poster-description: A closeup photograph of a man's face, taken whilst he is climbing up a New York skykscraper in a skin-tight red and blue suit, with a mask featuring 2 lens (in the shape of curved right triangles) for eyes.
    ### 
    title: The Dark Knight
    synopsis: Following the events of Batman Begins (2005), mighty Batman, Lieutenant James Gordon, and District Attorney Harvey Dent plan to arrest shady mob accountant Lau to bring down the mob. But Lau's detailed disclosures threaten Gotham's organised crime. As a result, the city's desperate mob bosses turn to The Joker, a sadistic, green-haired psychopath in a purple suit with a flair for crime. As the unstoppable criminal mastermind wreaks havoc, bringing Gotham to its knees with widespread anarchy and chaos, Batman must face his greatest challenge to battle injustice. However, is the Dark Knight prepared to walk the fine line between defender and avenger, hero and vigilante?
    poster-description: A bottom up photograph of a man dressed up in black body-suit (distinguished by having a mask with bat-like ears), standing in front a crumbling office building that has an massive bat logo emblazoned across its front.
    ###
    title: ${title}
    synopsis: ${synopsis}
    poster-description:
    ```,
    max_tokens: 100
  })
  fetchImageUrl(response.data.choices[0].text.trim())
}

async function fetchImageUrl(imagePrompt){
    const response = await openai.createImage({
      prompt: imagePrompt,
      n: 1,
      size: '512x512',
      response_format: "b64_json"
    })
    document.getElementById('output-img-container').innerHTML = `<img src="data:img/png;base64,${response.data.data[0].b64_json}">`
  }