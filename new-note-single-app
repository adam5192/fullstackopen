```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User types a note and clicks Save

    browser->>browser: JavaScript captures the form submission

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: Response confirms successful save (possibly status 201 or empty)
    deactivate server

    Note right of browser: JavaScript updates the in-memory note list and re-renders DOM dynamically

    Note right of browser: No page reload occurs — only the note list updates on the screen
