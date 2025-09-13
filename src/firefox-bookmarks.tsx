import { useState, useEffect, React } from 'react';
import { List, ActionPanel, Action, Image } from '@vicinae/api';
import { extractBookmarks } from './logic/get_bookmarks';

export type Bookmark = {
  guid: string,
  title: string,
  uri: string,
  iconUri: string,
  type: string,
  children: Bookmark[]
}

export type BookmarkSection = {
  name: string,
  children: Bookmark[]
}

function readBookmarksBySection(data: Bookmark): BookmarkSection[] {
  const sections: BookmarkSection[] = [];

  if (data.type === "text/x-moz-place-container" && Array.isArray(data.children)) {
    const children: Bookmark[] = [];
    let subsections: BookmarkSection[] = [];

    for (const child of data.children) {
      if (child.type === "text/x-moz-place-container") {
        subsections = subsections.concat(readBookmarksBySection(child));
      } else if (child.type === "text/x-moz-place") {
        children.push({
          guid: child.guid,
          title: child.title || child.uri,
          uri: child.uri,
          iconUri: child.iconUri || child.iconUri || "",
          type: "",
          children: []
        });
      }
    }

    if (children.length > 0) {
      sections.push({
        name: data.title || "Other Bookmarks",
        children: children.sort((a, b) => a.title.localeCompare(b.title)),
      });
    }
    sections.push(...subsections);
  }
  return sections;
}

export default function SimpleList() {
  const [sections, setSections] = useState<BookmarkSection[] | null>(null);

  useEffect(() => {
    (async () => {
      const raw_bookmarks = await extractBookmarks();
      const grouped = readBookmarksBySection(raw_bookmarks);
      setSections(grouped.sort((a, b) => a.name.localeCompare(b.name)));
    })();
  }, []);

  if (!sections) {
    return null;
  }

  return (
    <List searchBarPlaceholder='Search Bookmarks...'>
      {sections.map(section => (
        <List.Section key={section.name} title={section.name.charAt(0).toUpperCase() + String(section.name).slice(1)}>
          {section.children.map(bookmark => (
            <List.Item
              key={bookmark.guid}
              title={bookmark.title}
              keywords={bookmark.uri ? bookmark.uri.split(".") : []}
              icon={bookmark.iconUri
                ? { source: bookmark.iconUri, mask: Image.Mask.RoundedRectangle }
                : "firefox"
              }
              actions={
                <ActionPanel>
                  <Action.OpenInBrowser title="Open in Browser" url={bookmark.uri} />
                   <Action.CopyToClipboard title="Copy URL" content={bookmark.uri} shortcut={{ modifiers: ["ctrl", "shift"], key: "c" }} />
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
