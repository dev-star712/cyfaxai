import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/cookies";
import routes, {
  authenticatedRoutes,
  publicRoutes,
  unAuthenticatedRoutes,
} from "@/constants/routes";
import { getAuthTokensQueryOptions } from "@/cyfax-api-client/queries";
import { appCache } from "@/node-cache";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidDomainOrEmail(input: string): boolean {
  const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,11}?$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (domainPattern.test(input)) {
    return true;
  } else if (emailPattern.test(input)) {
    return true;
  } else {
    return false;
  }
}

export function isValidEmailForPublicReport(
  email: string,
  domainOrEmail: string,
) {
  // Regular expression for validating email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const domain = domainOrEmail.split("@")[1] || domainOrEmail;

  // Check if email matches the pattern
  if (!emailPattern.test(email)) {
    return { type: "invalid-email", domain };
  }

  // Extract the domain part of the email
  const emailDomain = email.substring(email.lastIndexOf("@") + 1);

  // Compare the extracted domain with the provided domain
  return { type: emailDomain === domain ? "valid" : "invalid-domain", domain };
}

export const getApiErrorMessage = (
  error: any,
  fallbackErrorMessage?: string,
) => {
  const defaultErrorMessage =
    fallbackErrorMessage || "Something went wrong. Please try again.";

  try {
    const error1 = error?.response?.data?.detail;
    const error2 = error?.response?.data?.data;
    const error3 = error?.response?.data;
    return (
      (typeof error1 === "string" && error1) ||
      (typeof error2 === "string" && error2) ||
      (typeof error3 === "string" && error3) ||
      defaultErrorMessage
    );
  } catch (error) {
    return defaultErrorMessage;
  }
};

export const formatDate = (timestamp?: number) => {
  if (typeof timestamp === "undefined") return "- - -";
  // Convert timestamp to milliseconds and create a Date object
  const date = new Date(timestamp * 1000);

  // Extract the month, day, and year from the Date object
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  // Format the date as mm/dd/yyyy
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
};

export const getAuthTokenOnClient = async () => {
  const accessToken = appCache.get(ACCESS_TOKEN.name);
  const refreshToken = appCache.get(REFRESH_TOKEN.name);

  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken,
    };
  } else {
    return getAuthTokensQueryOptions()
      .queryFn()
      .then((res) => {
        appCache.mset([
          {
            key: ACCESS_TOKEN.name,
            val: res.access_token,
          },
          {
            key: REFRESH_TOKEN.name,
            val: res.refresh_token,
          },
        ]);

        return {
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        };
      })
      .catch(() => {
        return {
          accessToken: null,
          refreshToken: null,
        };
      });
  }
};

export const isPathEqual = (path1: string, path2: string) => {
  const path_1 = path1.split("?")[0].replace("#", "");
  const path_2 = path2.split("?")[0].replace("#", "");

  return path_1 === path_2;
};

type Item = {
  is_exploit: boolean;
  cvss: number;
};
export function getTopItems<T extends Item>(arr: T[], count: number): T[] {
  // Filter items based on is_exploit = true
  const exploitItems = arr.filter((item) => item.is_exploit);

  // Sort the exploit items by cvss score in descending order
  const sortedExploitItems = exploitItems.sort((a, b) => b.cvss - a.cvss);

  // If there are less exploit items than needed, sort non-exploit items by cvss
  const nonExploitItems = arr
    .filter((item) => !item.is_exploit)
    .sort((a, b) => b.cvss - a.cvss);

  // Combine exploit and non-exploit items
  const combined = [...sortedExploitItems, ...nonExploitItems];

  // Sort combined list by is_exploit = true on top and then by cvss in descending order
  combined.sort((a, b) => {
    if (a.is_exploit === b.is_exploit) {
      return b.cvss - a.cvss; // Sort by cvss within the same is_exploit group
    }
    return a.is_exploit ? -1 : 1; // Prioritize is_exploit = true
  });

  // Return the required number of items from the combined list
  return combined.slice(0, count);
}
interface BaseItem {
  is_exploit: boolean;
  cvss: number;
}
export function getHighestCvssItem<T extends BaseItem>(items: T[]): T {
  // Filter items with is_exploit = true
  let exploitItems = items.filter((item) => item.is_exploit);

  // If no exploit items found, use the original array
  if (exploitItems.length === 0) {
    exploitItems = items;
  }

  // Find the item with the highest cvss score
  return exploitItems.reduce((prev, current) =>
    prev.cvss > current.cvss ? prev : current,
  );
}

type DataItem = {
  legend: string;
  count: number;
};
export function addColorToItems<T extends DataItem>(
  items: T[],
  baseColor: string,
) {
  // Extract lightness from base color
  const baseColorParts = baseColor.match(/\d+/g);
  if (!baseColorParts) {
    throw new Error("Invalid base color format");
  }

  const h = parseInt(baseColorParts[0]);
  const s = parseInt(baseColorParts[1]);
  const l = parseInt(baseColorParts[2]);

  // Find min and max count
  const counts = items.map((item) => item.count);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  // Normalize and adjust lightness based on count
  return items.map((item) => {
    const normalizedCount = (item.count - minCount) / (maxCount - minCount);
    const adjustedLightness = l - normalizedCount * 7; // Adjust lightness by 30%

    return {
      ...item,
      color: `hsl(${h}, ${s}%, ${adjustedLightness}%)`,
    };
  });
}

export const downloadPDF = (
  data: BlobPart,
  fileName: string = "report.pdf",
) => {
  try {
    //  // Fetch the PDF content from the API using Axios
    //  const response = await axios.get('/api/get-pdf', {
    //   responseType: 'blob', // This is important to handle the response as a blob
    // });
    // Create a URL for the blob
    const url = window.URL.createObjectURL(
      new Blob([data], { type: "application/pdf" }),
    );

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName); // Set the file name for the download
    document.body.appendChild(link);
    link.click();

    // Clean up by removing the link and revoking the object URL
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the PDF", error);
  }
};

function isStringRoute(route: string | ((slug: string) => string)): route is string {  
  return typeof route === "string";  
}  

export const isAuthenticatedRoute = (pathname: string) => {  
  console.log("pathname", pathname === routes.home && publicRoutes.includes(routes.home)  
  ? false  
  : !!authenticatedRoutes  
      .filter(isStringRoute) 
      .find((route) => route.startsWith(pathname)))
  return pathname === routes.home && publicRoutes.includes(routes.home)  
    ? false  
    : !!authenticatedRoutes  
        .filter(isStringRoute) 
        .find((route) => route.startsWith(pathname));  
};

export const isUnAuthenticatedRoute = (pathname: string) => {
  return !!unAuthenticatedRoutes.find((route) => route.startsWith(pathname));
};

export function fixedNumberIfNeeded(num: number): string | number {
  // Check if the number has a decimal part
  if (num % 1 !== 0) {
    // Fix the number to 2 decimal places
    return num.toFixed(2);
  }
  // If it's an integer, return the number as is
  return num;
}
