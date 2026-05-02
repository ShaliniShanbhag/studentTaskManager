package models;

import java.sql.Date;

public class Task {
    private int id;
    private int userId;
    private String taskTitle;
    private String description;
    private String status;
    private Date dueDate;

    public Task() {
    }

    public Task(int id, int userId, String taskTitle, String description, String status, Date dueDate) {
        this.id = id;
        this.userId = userId;
        this.taskTitle = taskTitle;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}
