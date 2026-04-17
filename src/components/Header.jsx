import { useState } from "react";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Text,
  tokens,
} from "@fluentui/react-components";
import { SettingsRegular } from "@fluentui/react-icons";
import { webDarkTheme, webLightTheme, FluentProvider } from "@fluentui/react-components";
import useStoreManager from "@/stores/useStoreManager";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ setTheme }) => {
  const [isDark, setIsDark] = useState(true);
  const activeStore = useStoreManager((s) => s.getActiveStore());
  const navigate = useNavigate();

  const handleDark = () => {
    setIsDark(true);
    setTheme?.(webDarkTheme);
  };

  const handleLight = () => {
    setIsDark(false);
    setTheme?.(webLightTheme);
  };

  return (
    <div className="header-bar">
      <Toolbar>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img src="/tamstool/avanade-logo.svg" alt="Logo" style={{ height: 24 }} />
          <Text weight="semibold" size={400}>
            TAMS Store Browser
          </Text>
        </div>
        <div style={{ flex: 1 }} />
        {activeStore && (
          <ToolbarButton onClick={() => navigate("/stores")}>
            {activeStore.name}
          </ToolbarButton>
        )}
        <ToolbarDivider />
        <Menu>
          <MenuTrigger>
            <ToolbarButton icon={<SettingsRegular />}>Settings</ToolbarButton>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => navigate("/stores")}>
                Manage Stores
              </MenuItem>
              <MenuItem disabled={isDark} onClick={handleDark}>
                Dark Mode
              </MenuItem>
              <MenuItem disabled={!isDark} onClick={handleLight}>
                Light Mode
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </Toolbar>
    </div>
  );
};

export default Header;
