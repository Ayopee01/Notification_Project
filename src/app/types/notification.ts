export type GdxAuthResponse = {
    Result?: string;
};

export type NotificationItem = {
    userId: string;
    message: string;
};

export type NotificationRequest = {
    appId: string;
    data: NotificationItem[];
    sendDateTime?: string | null;
};

export type NotificationResponse = {
    result?: string[];
    requestTimeStamp?: number;
    messageCode?: number;
    message?: string | null;
};

export type RequestBody = {
    agentId?: string;
    appId?: string;

    // single mode
    userId?: string;
    message?: string;

    // batch mode
    data?: NotificationItem[];

    sendDateTime?: string | null;
};

export type ApiResult = {
    ok: boolean;
    token?: string;
    notifyData?: {
        result?: string[];
        requestTimeStamp?: number;
        messageCode?: number;
        message?: string | null;
    };
    message?: string;
};
