import { useIntl } from "react-intl";

export const useTranslation = () => {
  const { messages } = useIntl(); 
  return messages as Record<string, string>;
};
