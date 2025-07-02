import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SecurityManager from "@/utils/security";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查localStorage中保存的主题偏好 - 使用安全存储
    const savedTheme = SecurityManager.getSecureItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // 默认使用日间模式（护眼黄色）
    const shouldBeDark = savedTheme === "dark" || (savedTheme === null && prefersDark);
    
    setIsDark(shouldBeDark);
    updateTheme(shouldBeDark);
  }, []);

  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    updateTheme(newTheme);
    try {
      await SecurityManager.setSecureItem("theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="h-10 w-10 p-0"
    >
      {isDark ? (
        <svg
          className="h-4 w-4 rotate-0 scale-100 transition-all"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 rotate-0 scale-100 transition-all"
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </Button>
  );
};

export default ThemeToggle;