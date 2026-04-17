import { useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Field,
  Input,
  Spinner,
  TabList,
  Tab,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  tokens,
} from "@fluentui/react-components";
import {
  CheckmarkCircleRegular,
  DismissCircleRegular,
} from "@fluentui/react-icons";
import useStoreManager from "@/stores/useStoreManager";

const AUTH_LABELS = {
  none: "None",
  bearer: "Bearer Token",
  client_credentials: "Client / Secret",
};

const StoreManager = () => {
  const stores = useStoreManager((s) => s.stores);
  const activeStoreId = useStoreManager((s) => s.activeStoreId);
  const addStore = useStoreManager((s) => s.addStore);
  const removeStore = useStoreManager((s) => s.removeStore);
  const updateStore = useStoreManager((s) => s.updateStore);
  const setActiveStore = useStoreManager((s) => s.setActiveStore);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formName, setFormName] = useState("");
  const [formEndpoint, setFormEndpoint] = useState("");
  const [formAuthType, setFormAuthType] = useState("none");
  const [formToken, setFormToken] = useState("");
  const [formTokenUrl, setFormTokenUrl] = useState("");
  const [formClientId, setFormClientId] = useState("");
  const [formClientSecret, setFormClientSecret] = useState("");
  const [formScope, setFormScope] = useState("");
  const [formCuttingRoomTamsId, setFormCuttingRoomTamsId] = useState("");
  const [testStatus, setTestStatus] = useState(null);

  const resetForm = () => {
    setFormName("");
    setFormEndpoint("");
    setFormCuttingRoomTamsId("");
    setFormAuthType("none");
    setFormToken("");
    setFormTokenUrl("");
    setFormClientId("");
    setFormClientSecret("");
    setFormScope("");
    setTestStatus(null);
    setEditingStore(null);
  };

  const handleAdd = () => {
    resetForm();
    setModalVisible(true);
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setFormName(store.name);
    setFormEndpoint(store.endpoint);
    setFormCuttingRoomTamsId(store.cuttingRoomTamsId || "");
    setFormAuthType(store.authType || (store.token ? "bearer" : "none"));
    setFormToken(store.token || "");
    setFormTokenUrl(store.tokenUrl || "");
    setFormClientId(store.clientId || "");
    setFormClientSecret(store.clientSecret || "");
    setFormScope(store.scope || "");
    setTestStatus(null);
    setModalVisible(true);
  };

  const buildStoreData = () => {
    const base = {
      name: formName.trim(),
      endpoint: formEndpoint.trim().replace(/\/+$/, ""),
      cuttingRoomTamsId: formCuttingRoomTamsId.trim() || null,
      authType: formAuthType,
    };
    if (formAuthType === "bearer") {
      return { ...base, token: formToken.trim() || null, tokenUrl: null, clientId: null, clientSecret: null };
    }
    if (formAuthType === "client_credentials") {
      return {
        ...base,
        token: null,
        tokenUrl: formTokenUrl.trim(),
        clientId: formClientId.trim(),
        clientSecret: formClientSecret.trim(),
        scope: formScope.trim() || null,
      };
    }
    return { ...base, token: null, tokenUrl: null, clientId: null, clientSecret: null };
  };

  const handleSave = () => {
    const storeData = buildStoreData();
    if (editingStore) {
      updateStore(editingStore.id, storeData);
    } else {
      addStore(storeData);
    }
    setModalVisible(false);
    resetForm();
  };

  const getTestToken = async () => {
    if (formAuthType === "bearer") {
      return formToken.trim() || null;
    }
    if (formAuthType === "client_credentials") {
      const parts = [
        `grant_type=client_credentials`,
        `client_id=${formClientId.trim()}`,
        `client_secret=${encodeURIComponent(formClientSecret.trim())}`,
      ];
      if (formScope.trim()) parts.push(`scope=${formScope.trim()}`);
      const response = await fetch("/__token_proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Token-Url": formTokenUrl.trim(),
        },
        body: parts.join("&"),
      });
      if (!response.ok) throw new Error("Token request failed");
      const data = await response.json();
      return data.access_token;
    }
    return null;
  };

  const handleTest = async () => {
    setTestStatus("loading");
    try {
      const endpoint = formEndpoint.trim().replace(/\/+$/, "");
      const headers = {
        "Content-Type": "application/json",
        "X-Target-Url": `${endpoint}/sources?limit=1`,
      };
      const token = await getTestToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch("/__api_proxy", { headers });
      setTestStatus(response.ok ? "success" : "error");
    } catch {
      setTestStatus("error");
    }
  };

  const isFormValid = formName.trim() && formEndpoint.trim();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Text size={500} weight="semibold">TAMS Stores</Text>
          <br />
          <Text size={200}>Connect to TAMS store endpoints. Credentials are stored only in your browser's localStorage.</Text>
        </div>
        <Button appearance="primary" onClick={handleAdd}>Add Store</Button>
      </div>

      {/* Table */}
      {stores.length === 0 ? (
        <div style={{ textAlign: "center", padding: 32 }}>
          <Text weight="semibold">No stores configured</Text>
          <br />
          <Text size={200}>Add a TAMS store endpoint to get started.</Text>
          <br />
          <Button style={{ marginTop: 8 }} onClick={handleAdd}>Add Store</Button>
        </div>
      ) : (
        <Table size="small">
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: 120 }} />
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Endpoint</TableHeaderCell>
              <TableHeaderCell style={{ width: 140 }}>Auth</TableHeaderCell>
              <TableHeaderCell style={{ width: 200 }}>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.id === activeStoreId ? (
                    <Badge appearance="filled" color="success">Active</Badge>
                  ) : (
                    <Button
                      appearance="transparent"
                      size="small"
                      onClick={() => setActiveStore(item.id)}
                    >
                      Set Active
                    </Button>
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.endpoint}</TableCell>
                <TableCell>{AUTH_LABELS[item.authType] || AUTH_LABELS.none}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: 4 }}>
                    <Button appearance="transparent" size="small" onClick={() => handleEdit(item)}>
                      Edit
                    </Button>
                    <Button appearance="transparent" size="small" onClick={() => removeStore(item.id)}>
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Modal */}
      <Dialog open={modalVisible} onOpenChange={(_, data) => { if (!data.open) setModalVisible(false); }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editingStore ? "Edit Store" : "Add Store"}</DialogTitle>
            <DialogContent>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Name" hint="A friendly name for this store.">
                  <Input
                    value={formName}
                    onChange={(e, data) => setFormName(data.value)}
                    placeholder="My TAMS Store"
                  />
                </Field>
                <Field label="Endpoint URL" hint="The base URL of the TAMS API.">
                  <Input
                    value={formEndpoint}
                    onChange={(e, data) => setFormEndpoint(data.value)}
                    placeholder="https://tams.example.com"
                    type="url"
                  />
                </Field>
                <Field label="CuttingRoom TAMS ID" hint="The store identifier used in CuttingRoom CRL references. Lowercase letters, numbers, and hyphens only.">
                  <Input
                    value={formCuttingRoomTamsId}
                    onChange={(e, data) =>
                      setFormCuttingRoomTamsId(
                        data.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    placeholder="my-tams-store"
                  />
                </Field>
                <Field label="Authentication">
                  <TabList
                    selectedValue={formAuthType}
                    onTabSelect={(_, data) => {
                      setFormAuthType(data.value);
                      setTestStatus(null);
                    }}
                  >
                    <Tab value="none">None</Tab>
                    <Tab value="bearer">Bearer Token</Tab>
                    <Tab value="client_credentials">Client / Secret</Tab>
                  </TabList>
                </Field>
                {formAuthType === "none" && (
                  <Text size={200}>No authentication. Use for public TAMS endpoints.</Text>
                )}
                {formAuthType === "bearer" && (
                  <Field hint="A static Bearer token sent with every request.">
                    <Input
                      value={formToken}
                      onChange={(e, data) => setFormToken(data.value)}
                      placeholder="Token"
                      type="password"
                    />
                  </Field>
                )}
                {formAuthType === "client_credentials" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Field label="Token URL" hint="The OAuth2 token endpoint.">
                      <Input
                        value={formTokenUrl}
                        onChange={(e, data) => setFormTokenUrl(data.value)}
                        placeholder="https://auth.example.com/oauth2/token"
                        type="url"
                      />
                    </Field>
                    <Field label="Client ID">
                      <Input
                        value={formClientId}
                        onChange={(e, data) => setFormClientId(data.value)}
                        placeholder="Client ID"
                      />
                    </Field>
                    <Field label="Client Secret">
                      <Input
                        value={formClientSecret}
                        onChange={(e, data) => setFormClientSecret(data.value)}
                        placeholder="Client Secret"
                        type="password"
                      />
                    </Field>
                    <Field label="Scope" hint="The OAuth2 scope for the token request (e.g. api://app-id/.default).">
                      <Input
                        value={formScope}
                        onChange={(e, data) => setFormScope(data.value)}
                        placeholder="api://app-id/.default"
                      />
                    </Field>
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button
                appearance="secondary"
                onClick={handleTest}
                disabled={!formEndpoint.trim()}
                icon={
                  testStatus === "loading" ? <Spinner size="tiny" /> :
                    testStatus === "success" ? <CheckmarkCircleRegular style={{ color: tokens.colorPaletteGreenForeground1 }} /> :
                      testStatus === "error" ? <DismissCircleRegular style={{ color: tokens.colorPaletteRedForeground1 }} /> :
                        undefined
                }
              >
                {testStatus === "loading" ? "Testing" :
                  testStatus === "success" ? "Connected" :
                    testStatus === "error" ? "Failed" :
                      "Test Connection"}
              </Button>
              <Button appearance="primary" onClick={handleSave} disabled={!isFormValid}>
                {editingStore ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};

export default StoreManager;
