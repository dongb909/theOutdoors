<h1 align="center"> WONDERLUST </h1>
<h4 align="center"> - The Outdoors - </h4>
# 
A place for wonderers to share their experience at any and all beautiful locations of nature around the world.
We all love to vacation but there are so many hiddens gems we might miss. This site allows people to discover such gems, share their experience, connect with other wonderers like themselves. 

Continue reading or check out the applications @ https://theoutdoor.herokuapp.com/
#
## Gallery

## Description
The gallery and carousel component for a vacation stay room booking service. 

## Requirements
- node 
- npm 
- ejs templates
- dotenv
- connect-flash
- express
- express-session
- mongoose
- passport

### Installing Dependencies
- npm run start

## API DOCUMENTATION

1. GET:

`/`
Fetch all locations
``` 
OUTPUT: JSON data type, array of objects
  [
    {
     
    }, {...}
  ]
```

2. POST:

`/`
Add photo to photos collection/table and reference to photos array for current listing ID into database. 
Can only add one photo at a time. 

``` 
INPUT: JSON data type
  {
   
  }
  
OUTPUT: Status code 200 or "Error message"
```

3. PUT:

`/`
Update photo with this photo Id within current listing to another reference number. 

```
INPUT: JSON data type
  {
   
  }

OUTPUT: Status code 200 or "Error message"
```

4. DELETE: 

`/`
Delete photo with this Id REFERENCE in this specific listing. Leave original photo in tact. 

```
INPUT: JSON data type
  {
  
  }

OUTPUT: Status code 200 or "Error message"
```
