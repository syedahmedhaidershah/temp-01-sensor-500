interface IBusinessParameters {
    sensors: {
        machineCount: number;
        maxRequestsPerSecond: number;
        /**
         * This is defined in seconds
         */
        acceptableRequestTimeRange: number;
    };

    systemResponsiveness: {
        concurrency: number;
        availability: number;
    };
}

export const businessParameters: IBusinessParameters = {
    sensors: {
        machineCount: 500,
        maxRequestsPerSecond: 4,
        acceptableRequestTimeRange: 1,
    },

    systemResponsiveness: {
        concurrency: 2000,
        availability: 100,
    }
}