import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  MessageBar,
  MessageBarBody,
  MessageBarActions,
  Button,
  tokens,
} from "@fluentui/react-components";
import { DismissRegular, NavigationRegular } from "@fluentui/react-icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import { useState } from "react";
import useAlertsStore from "@/stores/useAlertsStore";
import useStoreManager from "@/stores/useStoreManager";

const Layout = ({ setTheme }) => {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const alertItems = useAlertsStore((state) => state.alertItems);
  const activeStoreId = useStoreManager((s) => s.activeStoreId);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const breadCrumbs = () => {
    let breadCrumbPath = pathname;
    if (
      breadCrumbPath.startsWith("/player") ||
      breadCrumbPath.startsWith("/diagram")
    ) {
      const splitPath = pathname.split("/").filter((p) => p !== "");
      splitPath.push(splitPath.splice(0, 1)[0]);
      breadCrumbPath = "/" + splitPath.join("/");
    }
    const hrefs = breadCrumbPath
      .split("/")
      .slice(1)
      .reduce(
        (allPaths, subPath) => {
          const lastPath = allPaths[allPaths.length - 1];
          allPaths.push(
            lastPath.endsWith("/")
              ? lastPath + subPath
              : `${lastPath}/${subPath}`
          );
          return allPaths;
        },
        ["/"]
      );
    return hrefs.map((href) => ({
      text: href === "/" ? "home" : href.split("/").at(-1),
      href,
    }));
  };

  const activeStore = useStoreManager((s) => s.getActiveStore());

  const navItems = [
    { text: "Sources", href: "/sources", disabled: !activeStore },
    { text: "Flows", href: "/flows", disabled: !activeStore },
    { text: "Manage Stores", href: "/stores" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header setTheme={setTheme} />

      {/* Alerts / Notifications */}
      {alertItems.length > 0 && (
        <div style={{ padding: "8px 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {alertItems.map((item) => (
            <MessageBar
              key={item.id}
              intent={item.type === "error" ? "error" : "success"}
            >
              <MessageBarBody>{item.content}</MessageBarBody>
              {item.dismissible && (
                <MessageBarActions>
                  <Button
                    appearance="transparent"
                    icon={<DismissRegular />}
                    size="small"
                    onClick={item.onDismiss}
                  />
                </MessageBarActions>
              )}
            </MessageBar>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Side Navigation */}
        {navigationOpen && (
          <nav
            style={{
              width: 240,
              borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
              padding: "12px 0",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexShrink: 0,
              overflow: "auto",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
              onClick={() => navigate("/stores")}
            >
              {activeStore ? activeStore.name : "No store selected"}
            </div>
            <div
              style={{
                height: 1,
                background: tokens.colorNeutralStroke1,
                margin: "8px 16px",
              }}
            />
            {navItems.map((item) => (
              <div
                key={item.href}
                onClick={() => !item.disabled && navigate(item.href)}
                style={{
                  padding: "8px 16px",
                  cursor: item.disabled ? "default" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                  backgroundColor:
                    pathname.startsWith(item.href) && item.href !== "/"
                      ? tokens.colorNeutralBackground1Selected
                      : "transparent",
                  borderRadius: 4,
                  margin: "0 8px",
                  fontSize: 14,
                }}
              >
                {item.text}
              </div>
            ))}
          </nav>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
          {/* Breadcrumbs */}
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Button
              appearance="subtle"
              icon={<NavigationRegular />}
              size="small"
              onClick={() => setNavigationOpen((o) => !o)}
            />
            <Breadcrumb>
              {breadCrumbs().map((crumb, i, arr) => (
                <BreadcrumbItem key={crumb.href}>
                  <BreadcrumbButton
                    current={i === arr.length - 1}
                    onClick={() => navigate(crumb.href)}
                  >
                    {crumb.text}
                  </BreadcrumbButton>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </div>

          <div key={activeStoreId}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
