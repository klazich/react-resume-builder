import faker from 'faker'

const randomInRange = (s, e) => Math.floor(Math.random() * (e - s + 1)) + s

const randomRangeOfItem = itemFn => (s, e) =>
  Array.from({ length: randomInRange(s, e) }, () => itemFn())

const date = () => {
  const today = new Date()
  return [today.getFullYear(), today.getMonth() + 1, today.getDate()]
}

const stringDate = dateObj =>
  `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`

const fuzzDate = (y, m, d) => (fuzz = 1) => {
  const n = fuzz > 10 ? 10 : fuzz
  const from = new Date(m - n < 1 ? y - 1 : y, ((12 + m - n) % 12) - 1, d)
  const to = new Date(m + n > 12 ? y + 1 : y, ((m + n) % 12) - 1, d)
  return stringDate(faker.date.between(from, to))
}

// Basic Property Generator

const location = () => ({
  address: faker.address.streetAddress(),
  postalCode: faker.address.zipCode(),
  city: faker.address.city(),
  countryCode: faker.address.countryCode(),
  region: faker.address.state(),
})

const profiles = () =>
  faker.helpers
    .shuffle(['Twitter', 'Facebook', 'StackOverflow', 'GitHub', 'LinkedIn'])
    .slice(0, randomInRange(1, 5))
    .map(network => ({
      network,
      username: faker.internet.userName(),
      url: faker.internet.url(),
    }))

const basic = () => ({
  name: faker.name.findName(),
  label: faker.name.jobTitle(),
  image: faker.image.avatar(),
  email: faker.internet.email(),
  summary: faker.lorem.sentence(),
  url: faker.internet.url(),
  location: location(),
  profiles: profiles(),
})

// Work Property Generator

const workGenerator = function*() {
  const [year, month, day] = date()

  for (let y = year - randomInRange(6, 15); y <= year - 3; y += 3) {
    yield {
      name: faker.company.companyName(),
      location: faker.address.city(),
      description: faker.company.bs(),
      position: faker.name.jobTitle(),
      url: faker.internet.url(),
      startDate: fuzzDate(y, month, day)(1),
      endDate: fuzzDate(y + 3, month, day)(1),
      summary: faker.lorem.sentence(),
      highlights: randomRangeOfItem(faker.lorem.sentence)(2, 4),
    }
  }
}

// volunteer Property Generator

const volunteerGenerator = function*() {
  const [year, month, day] = date()

  for (let y = year - randomInRange(3, 12); y <= year - 2; y += 3) {
    yield {
      organization: faker.company.companyName(),
      position: faker.name.title(),
      url: faker.internet.url(),
      startDate: fuzzDate(y, month, day)(4),
      endDate: fuzzDate(y + 2, month, day)(4),
      summary: faker.lorem.sentence(),
      highlights: randomRangeOfItem(faker.lorem.sentence)(1, 2),
    }
  }
}

// Education Property Generator

const degree = () =>
  faker.helpers.randomize(['Associate', 'Bachelor', 'Masters', 'Doctorate'])

const course = () => {
  const prefix = faker.random.word().slice(0, 2)
  const number = `${faker.random.number()}`.slice(0, 4)
  const name = `${faker.company.catchPhraseAdjective()} ${faker.company.bsNoun()}`
  return `${prefix}${number} - ${name}`.toUpperCase()
}

const educationGenerator = function*() {
  const [year, month, day] = date()

  for (let y = year - randomInRange(5, 15); y < year - 4; y += 4) {
    yield {
      institution: `University of ${faker.address.state()}`,
      area: `${faker.name.jobArea()} ${faker.name.jobArea()}`,
      studyType: degree(),
      startDate: fuzzDate(y, month, day)(1),
      endDate: fuzzDate(y + 4, month, day)(1),
      gpa: (3 + Math.random()).toFixed(1),
      courses: randomRangeOfItem(course)(3, 5),
    }
  }
}

// Awards Property Generator

const awardsGenerator = function*() {
  const [year, month, day] = date()

  for (let i = 0; i < randomInRange(1, 5); i += 1) {
    yield {
      title: `${faker.company
        .catchPhrase()
        .replace(/[ -]\w/g, s => s.toUpperCase())} Award`,
      date: stringDate(
        faker.date.between(
          new Date(year - 15, month, day),
          new Date(year, month, day)
        )
      ),
      awarder: faker.company.companyName(),
      summary: faker.lorem.sentence(),
    }
  }
}

// Publications Property Generator

const publicationsGenerator = function*() {
  const [year, month, day] = date()

  for (let i = 0; i < randomInRange(1, 5); i += 1) {
    const bs = faker.company.bs()
    const name = bs[0].toUpperCase() + bs.slice(1)
    yield {
      name,
      publisher: faker.company.companyName(),
      releaseDate: stringDate(
        faker.date.between(
          new Date(year - 15, month, day),
          new Date(year, month, day)
        )
      ),
      url: faker.internet.url(),
      summary: faker.lorem.paragraph(),
    }
  }
}

export const resume = {
  basic: basic(),
  work: [...workGenerator()],
  volunteer: [...volunteerGenerator()],
  education: [...educationGenerator()],
  awards: [...awardsGenerator()],
  publications: [...publicationsGenerator()],
}

/*
{
  skills: [
    {
      name: 'Web Development',
      level: 'Master',
      keywords: ['HTML', 'CSS', 'Javascript'],
    },
    {
      name: 'Compression',
      level: 'Master',
      keywords: ['Mpeg', 'MP4', 'GIF'],
    },
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Native speaker',
    },
  ],
  interests: [
    {
      name: 'Wildlife',
      keywords: ['Ferrets', 'Unicorns'],
    },
  ],
  references: [
    {
      name: 'Erlich Bachman',
      reference:
        'It is my pleasure to recommend Richard, his performance working as a consultant for Main St. Company proved that he will be a valuable addition to any company.',
    },
  ],
  projects: [
    {
      name: 'Miss Direction',
      description: 'A mapping engine that misguides you',
      highlights: [
        'Won award at AIHacks 2016',
        'Built by all women team of newbie programmers',
        'Using modern technologies such as GoogleMaps, Chrome Extension and Javascript',
      ],
      keywords: ['GoogleMaps', 'Chrome Extension', 'Javascript'],
      startDate: '2016-08-24',
      endDate: '2016-08-24',
      url: 'missdirection.example.com',
      roles: ['Team lead', 'Designer'],
      entity: 'Smoogle',
      type: 'application',
    },
  ],
}
*/
