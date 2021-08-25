# Welcome to Weld's frontend coding-challenge

## Introduction

At Weld we use TypeScript, [Create React App](https://create-react-app.dev/), [TailwindCSS](https://tailwindcss.com/) and [Apollo GraphQL](https://www.apollographql.com/) for our frontend application, so this project also reflects that. On our back-end we use NestJS.

Fork this repository and create your own repository to get started.

## Challenge

You will build a few new features on the app in the repository. The app currently shows a list of data points that each has two fields: text and id. It uses a fake api inspired by Apollo located in src/fakeApollo.tsx. Right now the app only supports showing and removing of data points.

### Steps in challenge

- Add a description field to the data points
- The fake internet speed in the fake api is pretty slow, so some loading states might be needed
- Make the app support adding of new data points through another page on /new (use useReducer for managing the internal state of this page) (use react-router-dom for routing)
- It should be possible to clear any field with a click on a button
- The form should be validated
- If you add a lot of data points to the list, it would probably be nice with some pagination
- The app should also support editing the title and description of the data points on the route /edit/:id
- When deleting a data point, it should be possible to regret and restore it within 10 seconds in some way
- Make a components structure that you think makes sense for the app
- Use tailwindcss for styling, don't write any custom css

## How we evaluate

The test is solely for you to show techniques and design patterns you normally use. Once the techniques and design patterns have been demonstrated then that is enough. No neeed for additional boilerplate. Just include a future work section in your answer and we will include questions in the technical interview.

- We understand that this can be **time consuming**. If you are short on time - then leave something out. But be sure to tell us your approach to the problem in the documentation.
- A documented answer that explains your approach, short-comings, how-to-run and future work.
- We appreciate small commits with a trail of messages that shows us how you work.
