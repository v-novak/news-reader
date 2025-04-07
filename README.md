# News Viewer

A React application that displays news feed from a content management API using Bootstrap for styling.

## Features

- Fetches publications from the API
- Displays news in a responsive grid layout
- Shows images and tags for each publication
- Loading and error states
- Bootstrap styling for a modern look
- Tag-based filtering
- Pagination support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Technologies Used

- React
- Bootstrap
- Axios for API calls
- React Router for navigation

## API Documentation

### Endpoints

The application communicates with the following API endpoint:

```
GET https://api.qa.zfx.com/content-management/v1/publications
```

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `fields` | Comma-separated list of fields to include in the response | `image.url,tags.name,content,title,customDate,createdAt,publishedAt,updatedAt,assetIds` |
| `pageSize` | Number of items per page | `25` |
| `pageNumber` | Page number to retrieve | `1` |
| `filters.tags.attributes.name` | Filter publications by tag name | `news` |

### Response Structure

The API returns a JSON object with the following structure:

```json
{
  "result": [
    {
      "id": "1",
      "attributes": {
        "title": "Article Title",
        "content": "Article content in HTML format",
        "publishedAt": "2023-01-01T12:00:00.000Z",
        "updatedAt": "2023-01-02T14:30:00.000Z",
        "createdAt": "2023-01-01T10:00:00.000Z",
        "customDate": "2023-01-01",
        "image": {
          "data": {
            "attributes": {
              "url": "https://example.com/image.jpg"
            }
          }
        },
        "tags": {
          "data": [
            {
              "id": "1",
              "attributes": {
                "name": "news"
              }
            }
          ]
        },
        "assetIds": ["asset1", "asset2"]
      }
    }
  ],
  "pagination": {
    "pageNumber": 1,
    "pageSize": 25,
    "total": 100
  }
}
```

### Data Structures

#### Publication Object

Each publication in the `result` array has the following structure:

- `id`: Unique identifier for the publication
- `attributes`: Object containing publication data
  - `title`: Title of the publication
  - `content`: HTML content of the publication
  - `publishedAt`: ISO date string when the publication was published
  - `updatedAt`: ISO date string when the publication was last updated
  - `createdAt`: ISO date string when the publication was created
  - `customDate`: Custom date field
  - `image`: Object containing image data
    - `data.attributes.url`: URL of the image
  - `tags`: Object containing tag data
    - `data`: Array of tag objects
      - `id`: Tag ID
      - `attributes.name`: Tag name
  - `assetIds`: Array of asset IDs associated with the publication

#### Pagination Object

The `pagination` object contains:

- `pageNumber`: Current page number
- `pageSize`: Number of items per page
- `total`: Total number of items available 