export const useUrl = () => {
  const getQueryString = (params: Record<string, string>) => {
    return new URLSearchParams(params).toString();
  };

  const appendQueryString = (url: string, queryParams: Record<string, string>) => {
    return isObjectEmpty(queryParams) ? url : `${url}?${getQueryString(queryParams)}`;
  };

  return {
    getQueryString,
    appendQueryString,
  };
};
