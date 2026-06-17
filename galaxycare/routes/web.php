<?php

use App\Http\Controllers\AnonymousFeedbackController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Reports\AdminCampusInformationController;
use App\Http\Controllers\Reports\AdminReportController;
use App\Http\Controllers\Reports\ReportController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Support\Facades\Route;

// Public pages
Route::get('/', HomeController::class)->name('home');
Route::get('/campus-information', [HomeController::class, 'campusInformation'])->name('campus-information');
Route::get('/progress', [HomeController::class, 'progress'])->name('progress');
Route::get('/forum', [AnonymousFeedbackController::class, 'index'])->name('forum');

// Protected pages (require login)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/forum', [AnonymousFeedbackController::class, 'store'])->name('forum.store');
    Route::post('/forum/{feedback}/replies', [AnonymousFeedbackController::class, 'reply'])->name('forum.replies.store');
    Route::post('/forum/{feedback}/reactions', [AnonymousFeedbackController::class, 'toggleReaction'])->name('forum.reactions.toggle');
});

Route::redirect('/proress', '/progress');

// Authenticated routes
Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/create', [ReportController::class, 'create'])->name('reports.create');
        Route::post('reports', [ReportController::class, 'store'])->name('reports.store');
        Route::get('reports/{report}', [ReportController::class, 'show'])->name('reports.show');
        Route::delete('reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');

        // Notifications
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
        Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');

        // Admin
        Route::prefix('admin')->middleware(EnsureUserIsAdmin::class)->group(function () {
            Route::get('reports', [AdminReportController::class, 'index'])->name('admin.reports.index');
            Route::get('campus-information', [AdminCampusInformationController::class, 'index'])->name('admin.campus-information.index');
            Route::post('campus-information', [AdminCampusInformationController::class, 'store'])->name('admin.campus-information.store');
            Route::delete('campus-information/{information}', [AdminCampusInformationController::class, 'destroy'])->name('admin.campus-information.destroy');
            Route::get('reports/{report}', [AdminReportController::class, 'show'])->name('admin.reports.show');
            Route::patch('reports/{report}', [AdminReportController::class, 'update'])->name('admin.reports.update');
            Route::delete('reports/{report}', [AdminReportController::class, 'destroy'])->name('admin.reports.destroy');
        });
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
