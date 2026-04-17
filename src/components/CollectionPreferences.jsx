import { useState, useCallback, useRef } from "react";
import {
    Button,
    Dialog,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    Radio,
    Switch,
    Text,
    tokens,
} from "@fluentui/react-components";
import {
    SettingsRegular,
    ReOrderDotsVerticalRegular,
} from "@fluentui/react-icons";
import { PAGE_SIZE_PREFERENCE } from "@/constants";

const CollectionPreferences = ({
    preferences,
    onConfirm,
    columnDefinitions,
}) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(null);
    const dragItem = useRef(null);
    const dragOver = useRef(null);

    const handleOpen = () => {
        setDraft({
            pageSize: preferences.pageSize,
            contentDisplay: preferences.contentDisplay.map((c) => ({ ...c })),
        });
        setOpen(true);
    };

    const handleConfirm = () => {
        onConfirm(draft);
        setOpen(false);
    };

    const toggleColumn = (id) => {
        setDraft((prev) => ({
            ...prev,
            contentDisplay: prev.contentDisplay.map((c) =>
                c.id === id ? { ...c, visible: !c.visible } : c
            ),
        }));
    };

    const handleDragStart = useCallback((index) => {
        dragItem.current = index;
    }, []);

    const handleDragEnter = useCallback((index) => {
        dragOver.current = index;
    }, []);

    const handleDragEnd = useCallback(() => {
        if (dragItem.current === null || dragOver.current === null) return;
        if (dragItem.current === dragOver.current) {
            dragItem.current = null;
            dragOver.current = null;
            return;
        }
        setDraft((prev) => {
            const items = [...prev.contentDisplay];
            const [moved] = items.splice(dragItem.current, 1);
            items.splice(dragOver.current, 0, moved);
            return { ...prev, contentDisplay: items };
        });
        dragItem.current = null;
        dragOver.current = null;
    }, []);

    const getLabel = (id) => {
        const col = columnDefinitions.find((c) => c.id === id);
        return col?.header ?? id;
    };

    return (
        <>
            <Button
                appearance="transparent"
                icon={<SettingsRegular />}
                onClick={handleOpen}
                size="small"
            />
            <Dialog
                open={open}
                onOpenChange={(_, data) => {
                    if (!data.open) setOpen(false);
                }}
            >
                <DialogSurface style={{ maxWidth: 640 }}>
                    <DialogBody>
                        <DialogTitle>Preferences</DialogTitle>
                        <DialogContent>
                            <div style={{ display: "flex", gap: 32 }}>
                                {/* Page size */}
                                <div style={{ minWidth: 160 }}>
                                    <Text weight="semibold" size={300}>
                                        {PAGE_SIZE_PREFERENCE.title}
                                    </Text>
                                    <RadioGroup
                                        value={String(draft?.pageSize)}
                                        onChange={(_, data) =>
                                            setDraft((prev) => ({
                                                ...prev,
                                                pageSize: Number(data.value),
                                            }))
                                        }
                                        style={{ marginTop: 8 }}
                                    >
                                        {PAGE_SIZE_PREFERENCE.options.map((opt) => (
                                            <Radio
                                                key={opt.value}
                                                value={String(opt.value)}
                                                label={opt.label}
                                            />
                                        ))}
                                    </RadioGroup>
                                </div>

                                {/* Column preferences */}
                                <div style={{ flex: 1 }}>
                                    <Text weight="semibold" size={300}>
                                        Column preferences
                                    </Text>
                                    <Text
                                        size={200}
                                        style={{
                                            display: "block",
                                            color: tokens.colorNeutralForeground3,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Customize the columns visibility and order.
                                    </Text>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        }}
                                    >
                                        {draft?.contentDisplay.map((col, index) => (
                                            <div
                                                key={col.id}
                                                draggable
                                                onDragStart={() => handleDragStart(index)}
                                                onDragEnter={() => handleDragEnter(index)}
                                                onDragEnd={handleDragEnd}
                                                onDragOver={(e) => e.preventDefault()}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    padding: "4px 8px",
                                                    borderRadius: 4,
                                                    cursor: "grab",
                                                    backgroundColor: tokens.colorNeutralBackground1Hover,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                    }}
                                                >
                                                    <ReOrderDotsVerticalRegular
                                                        style={{ color: tokens.colorNeutralForeground3 }}
                                                    />
                                                    <Text size={300}>{getLabel(col.id)}</Text>
                                                </div>
                                                <Switch
                                                    checked={col.visible}
                                                    onChange={() => toggleColumn(col.id)}
                                                    disabled={col.id === "id"}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button appearance="secondary" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button appearance="primary" onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};

export default CollectionPreferences;
