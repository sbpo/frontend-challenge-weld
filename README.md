# Weld's frontend coding-challenge solution

This repository contains my response to the frontend coding challenge from weld. I have solved all tasks described in the assignmend. I have not used any dependencies or tools outside the one's supplied in the initial code.

## How to run

#### `yarn install`

#### `yarn start`

<br/>
<br/>

## App structure

#### `App.tsx`

The entrypoint to the app containing API provider, router and renders other components.
<br/>

#### `components/MainDataList/MainDataList.tsx`

Component for the main page, showing the data list with pagenation.
<br/>

#### `components/MutateData/EditDataForm.tsx`

Component containing form field for creating/modifying a Data item, build using the useReducer to manage state.
<br/>

#### `components/MutateData/NewdataPage.tsx`

Component rendering the editDataform in a SlideOver-page and
<br/>

#### `components/basics/..`

Contains a number of basic components needed across the application implemented.
<br/>

<br/>
<br/>

## My approach

I started out getting an overview of the challenge, the initial bolierplate code, and the feature that should be added to solve it.
I then started solving the steps by working from within the initial App.tsx and adding components as needed. I tried working mainly with application logic within a few files, and not thinking too much about the file structure, while tried to keep the components as simple and straight forward as possible.
<br/><br/>
As I build the APP I running it in the browser using it constantly, and trying to optimise first the internal logic of the components, and the overall UX of using the APP.
<br/><br/>
I decided to put the add/edit pages in a "Slideover" component, so that the main since I thought this made the app alot nicer to work with by always displaying the list of data.
<br/><br/>
After having most features done, I refactored the APP splitting it into a more easy to approach file structure.
<br/><br/>

### Short commings

- Forms are only validated very simply, by checking if fields are empty.
- API requests do not have any error handling yet
  <br/><br/>

### Future work

Besides fixing the short commings, it would be nice to add a few extra tweeks to make the UI nicer to work with:

- When updating data, it would be nice to show which item in the list is currently being edited.
- When deleting an item, it would be nice to only display loading on the item being deleted.
