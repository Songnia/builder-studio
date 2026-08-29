<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class SuperAdminFrontendRouteTest extends TestCase
{
    public function test_admin_entrypoint_registers_the_transactions_page(): void
    {
        $projectRoot = dirname(__DIR__, 3);
        $router = file_get_contents($projectRoot.'/frontend/src/AppAdmin.tsx');

        $this->assertIsString($router);
        $this->assertStringContainsString(
            "import TransactionsList from '@/pages/superadmin/TransactionsList';",
            $router
        );
        $this->assertStringContainsString(
            '<Route path="/superadmin/transactions" element={<TransactionsList />} />',
            $router
        );
    }

    public function test_user_registry_exposes_direct_plan_change_control(): void
    {
        $projectRoot = dirname(__DIR__, 3);
        $registry = file_get_contents($projectRoot.'/frontend/src/pages/superadmin/PhotographersList.tsx');
        $detail = file_get_contents($projectRoot.'/frontend/src/pages/superadmin/SuperAdminUserDetail.tsx');

        $this->assertIsString($registry);
        $this->assertIsString($detail);
        $this->assertStringContainsString('Changer le forfait', $registry);
        $this->assertStringContainsString('#abonnement', $registry);
        $this->assertStringContainsString('/change-plan', $detail);
    }

    public function test_superadmin_control_views_and_resources_alias_are_registered_in_both_frontend_entrypoints(): void
    {
        $projectRoot = dirname(__DIR__, 3);
        $adminRouter = file_get_contents($projectRoot.'/frontend/src/AppAdmin.tsx');
        $unifiedRouter = file_get_contents($projectRoot.'/frontend/src/App.tsx');
        $expectedRoutes = [
            '<Route path="/superadmin/audit-log" element={<SuperAdminAuditLog />} />',
            '<Route path="/superadmin/resources" element={<ResourceControlCenter />} />',
            '<Route path="/superadmin/users/:id" element={<SuperAdminUserDetail />} />',
            '<Route path="/resources" element={<Navigate to="/superadmin/resources" replace />} />',
        ];

        $this->assertIsString($adminRouter);
        $this->assertIsString($unifiedRouter);
        foreach ($expectedRoutes as $route) {
            $this->assertStringContainsString($route, $adminRouter);
            $this->assertStringContainsString($route, $unifiedRouter);
        }
    }

    public function test_subscription_decision_form_explains_reason_and_date_requirements(): void
    {
        $projectRoot = dirname(__DIR__, 3);
        $detail = file_get_contents($projectRoot.'/frontend/src/pages/superadmin/SuperAdminUserDetail.tsx');

        $this->assertIsString($detail);
        $this->assertStringContainsString('5 caractères minimum', $detail);
        $this->assertStringContainsString('minLength={5}', $detail);
        $this->assertStringContainsString('caractère(s) requis', $detail);
        $this->assertStringContainsString('La date de fin doit être postérieure', $detail);
    }
}
