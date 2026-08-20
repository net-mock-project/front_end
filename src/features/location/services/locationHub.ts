import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";


export const locationHub= new HubConnectionBuilder()
.withUrl("https://localhost:7191/hub/location")
.withAutomaticReconnect()
.configureLogging(LogLevel.Information)
.build()