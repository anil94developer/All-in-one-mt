import {useTheme} from './ThemeProvider';
const myTheme = () => {
  const [theme, setTheme] = useTheme();
  return theme;
};
export {myTheme};
